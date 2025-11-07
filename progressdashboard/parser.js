const fs = require('fs');
const path = require('path');

const projectFilePath = path.join(__dirname, '..', 'PROYECTO.md');
const outputFilePath = path.join(__dirname, 'data', 'project_data.json');

try {
    const projectFileContent = fs.readFileSync(projectFilePath, 'utf8');
    const lines = projectFileContent.split('\n');

    const phases = [];
    let currentPhase = null;
    let overallTasks = 0;
    let overallCompletedTasks = 0;

    const phaseRegex = /^## (\d+\.\s*.+)/;
    const taskRegex = /^- \[(\s|x|✓)\] (.+)/;

    for (const line of lines) {
        const phaseMatch = line.match(phaseRegex);
        if (phaseMatch) {
            if (currentPhase) {
                phases.push(currentPhase);
            }
            currentPhase = {
                name: phaseMatch[1],
                tasks: [],
                totalTasks: 0,
                completedTasks: 0,
                progress: 0,
            };
        }

        const taskMatch = line.match(taskRegex);
        if (taskMatch && currentPhase) {
            const isCompleted = taskMatch[1] === 'x' || taskMatch[1] === '✓';
            currentPhase.tasks.push({
                name: taskMatch[2],
                completed: isCompleted,
            });
            currentPhase.totalTasks++;
            overallTasks++;
            if (isCompleted) {
                currentPhase.completedTasks++;
                overallCompletedTasks++;
            }
        }
    }

    if (currentPhase) {
        phases.push(currentPhase);
    }

    for (const phase of phases) {
        if (phase.totalTasks > 0) {
            phase.progress = (phase.completedTasks / phase.totalTasks) * 100;
        }
    }

    const overallProgress = overallTasks > 0 ? (overallCompletedTasks / overallTasks) * 100 : 0;

    const projectData = {
        projectName: 'RD-AMI Progress',
        lastUpdated: new Date().toISOString(),
        overallProgress,
        phases,
        needsAction: [], // Placeholder for actions needed from AMI
    };

    fs.writeFileSync(outputFilePath, JSON.stringify(projectData, null, 2));

    console.log('Project data parsed and saved to project_data.json');
} catch (error) {
    console.error('Error parsing project file:', error);
    process.exit(1);
}
