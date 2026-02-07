
// Helper for toggling event month visibility
window.toggleMonthEvents = function (monthKey) {
    const container = document.getElementById(`events-grid-${monthKey}`);
    const icon = document.getElementById(`icon-${monthKey}`);

    if (container) {
        const isHidden = container.style.display === 'none';
        container.style.display = isHidden ? 'grid' : 'none';

        // Update icon rotation
        if (icon) {
            // If we are showing it (was hidden), rotate arrow to point down (expanded)
            // If we are hiding it, rotate to point right (collapsed)
            icon.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
        }
    }
};
