const fs = require('fs');
const path = require('path');

const projectFilePath = path.join(__dirname, '..', 'PROYECTO.md');
const outputFilePath = path.join(__dirname, 'data', 'project_data.json');

try {
    const projectFileContent = fs.readFileSync(projectFilePath, 'utf8');

    const startMarker = '<!-- progress-modules:start -->';
    const endMarker = '<!-- progress-modules:end -->';

    const startIndex = projectFileContent.indexOf(startMarker);
    const endIndex = projectFileContent.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
        throw new Error('Could not find the progress-modules table in PROYECTO.md');
    }

    const tableContent = projectFileContent.substring(startIndex + startMarker.length, endIndex).trim();
    const lines = tableContent.split('\n').map(line => line.trim()).filter(line => line.startsWith('|') && !line.includes('---'));

    const headerLine = lines.find(line => line.includes('| id |'));
    if (!headerLine) {
        throw new Error('Could not find the header row in the progress-modules table.');
    }
    const header = headerLine.split('|').map(h => h.trim()).filter(Boolean);
    const rows = lines.slice(lines.indexOf(headerLine) + 1);

    const modules = rows.map(row => {
        const values = row.split('|').map(v => v.trim()).filter(Boolean);
        const moduleData = {};
        header.forEach((key, index) => {
            moduleData[key] = values[index];
        });
        return moduleData;
    });

    const phases = {};
    
    modules.forEach(mod => {
        const phaseName = mod.phase;
        if (!phases[phaseName]) {
            phases[phaseName] = {
                name: phaseName,
                tasks: [],
                totalTasks: 0,
                completedTasks: 0,
            };
        }
        const isCompleted = mod.status === 'done' || parseInt(mod.progress, 10) === 100;
        phases[phaseName].tasks.push({
            name: mod.name,
            completed: isCompleted,
        });
        phases[phaseName].totalTasks++;
        if(isCompleted) {
            phases[phaseName].completedTasks++;
        }
    });
    
    const phaseArray = Object.values(phases);

    phaseArray.forEach(phase => {
        phase.progress = phase.totalTasks > 0 ? (phase.completedTasks / phase.totalTasks) * 100 : 0;
    });

    const overallCompletedModules = modules.filter(m => m.status === 'done' || parseInt(m.progress, 10) === 100).length;
    const overallProgress = modules.length > 0 ? (overallCompletedModules / modules.length) * 100 : 0;

    const projectData = {
        projectName: 'RD-AMI Progress',
        lastUpdated: new Date().toISOString(),
        overallProgress,
        phases: phaseArray.sort((a, b) => a.name.localeCompare(b.name)),
        needsAction: modules.filter(m => m.needs && m.needs.trim() !== '' && m.needs.trim() !== '---').map(m => `${m.name}: ${m.needs}`),
    };

    fs.writeFileSync(outputFilePath, JSON.stringify(projectData, null, 2));

    console.log('Project data parsed correctly from the module table and saved to project_data.json');
} catch (error) {
    console.error('Error parsing project file:', error);
    process.exit(1);
}
