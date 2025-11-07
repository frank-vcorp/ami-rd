document.addEventListener('DOMContentLoaded', () => {
    const lastUpdatedEl = document.getElementById('last-updated');
    const overallProgressBar = document.getElementById('overall-progress-bar');
    const phasesContainer = document.getElementById('phases-container');
    const actionItemsEl = document.getElementById('action-items');

    fetch('/progress-ami/progressdashboard/data/project_data.json')
        .then(response => response.json())
        .then(data => {
            // Actualizar última actualización
            lastUpdatedEl.textContent = new Date(data.lastUpdated).toLocaleString('es-MX');

            // Actualizar progreso general
            overallProgressBar.style.width = `${data.overallProgress.toFixed(2)}%`;
            overallProgressBar.textContent = `${data.overallProgress.toFixed(2)}%`;

            // Renderizar fases
            data.phases.forEach(phase => {
                const phaseCard = document.createElement('div');
                phaseCard.className = 'bg-white p-6 rounded-lg shadow-md';

                let tasksHtml = '';
                phase.tasks.forEach(task => {
                    tasksHtml += `
                        <li class="flex items-center justify-between py-1">
                            <span class="${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}">${task.name}</span>
                            <span class="${task.completed ? 'text-green-500' : 'text-gray-400'}">
                                ${task.completed ? '✓' : '○'}
                            </span>
                        </li>
                    `;
                });

                phaseCard.innerHTML = `
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">${phase.name}</h3>
                    <div class="w-full bg-gray-200 rounded-full h-6 mb-4">
                        <div class="bg-green-500 h-6 text-xs font-medium text-green-100 text-center p-1 leading-none rounded-full" style="width: ${phase.progress.toFixed(2)}%">${phase.progress.toFixed(2)}%</div>
                    </div>
                    <ul class="divide-y divide-gray-200">
                        ${tasksHtml}
                    </ul>
                `;
                phasesContainer.appendChild(phaseCard);
            });

            // Renderizar puntos de acción
            if (data.needsAction && data.needsAction.length > 0) {
                data.needsAction.forEach(item => {
                    const actionItem = document.createElement('li');
                    actionItem.textContent = item;
                    actionItemsEl.appendChild(actionItem);
                });
            } else {
                const noActionItem = document.createElement('li');
                noActionItem.textContent = 'No hay puntos de acción pendientes.';
                actionItemsEl.appendChild(noActionItem);
            }

        })
        .catch(error => {
            console.error('Error al cargar los datos del proyecto:', error);
            phasesContainer.innerHTML = '<p class="text-red-500">Error al cargar los datos del dashboard.</p>';
        });
});
