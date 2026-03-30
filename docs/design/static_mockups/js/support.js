/**
 * Resolution Ledger - Support Panel JS
 * Handles dynamic list rendering, filtering, sorting, and detail views
 */

const app = {
    // Dane symulacyjne
    complaints: [
        { id: '#LOG-88291', reporter: 'Jan Kowalski (C-1928)', product: 'Industrial Consumable Batch', type: 'Uszkodzenie', date: '21.03.2026', status: 'nowe', statusHtml: '<span class="badge badge-new">Nowe</span>', hasNotes: true },
        { id: '#LOG-88244', reporter: 'Euro-Trans Sp.', product: 'Paleta EUR - Elektronika', type: 'Brak towaru', date: '20.03.2026', status: 'w_trakcie', statusHtml: '<span class="badge badge-progress">W trakcie</span>', hasNotes: true },
        { id: '#LOG-88102', reporter: 'Anna Nowak (C-0982)', product: 'Materiały Biurowe Premium', type: 'Uszkodzenie', date: '19.03.2026', status: 'rozpatrzone', statusHtml: '<span class="badge badge-resolved">Rozpatrzone</span><span class="badge badge-success-outline" style="margin-left:8px;">Uznane</span>', result: 'uznane', hasNotes: false },
        { id: '#LOG-88055', reporter: 'Logistix Corp', product: 'Części Zamienne X-200', type: 'Opóźnienie', date: '15.03.2026', status: 'rozpatrzone', statusHtml: '<span class="badge badge-resolved">Rozpatrzone</span><span class="badge badge-error-outline" style="margin-left:8px;">Odrzucone</span>', result: 'odrzucone', hasNotes: true },
        { id: '#LOG-88010', reporter: 'Michał Wiśniewski', product: 'Zestaw montażowy Z-90', type: 'Brak towaru', date: '10.03.2026', status: 'w_trakcie', statusHtml: '<span class="badge badge-progress">W trakcie</span>', hasNotes: true }
    ],

    currentSort: { column: 'date', order: 'desc' },
    activeComplaintId: null,

    init: function() {
        this.renderTable();
        this.setupEventListeners();
    },

    setupEventListeners: function() {
        // Filtr wyszukiwania
        document.getElementById('search-input').addEventListener('input', () => this.renderTable());
        document.getElementById('filter-status').addEventListener('change', () => this.renderTable());
        document.getElementById('filter-type').addEventListener('change', () => this.renderTable());
    },

    // Renderowanie dynamicznej tabeli (z uwzględnieniem filtrowania i sortowania)
    renderTable: function() {
        const searchQuery = document.getElementById('search-input').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        const typeFilter = document.getElementById('filter-type').value;
        
        const tbody = document.getElementById('table-body');
        const emptyState = document.getElementById('table-empty-state');
        const tableHeader = document.querySelector('.table-header');
        
        tbody.innerHTML = '';
        
        let filtered = this.complaints.filter(c => {
            const matchesSearch = c.id.toLowerCase().includes(searchQuery) || 
                                  c.reporter.toLowerCase().includes(searchQuery) || 
                                  c.product.toLowerCase().includes(searchQuery);
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            const matchesType = typeFilter === 'all' || c.type.toLowerCase().includes(typeFilter);
            
            return matchesSearch && matchesStatus && matchesType;
        });

        // Wbudowane proste sortowanie symulacyjne
        filtered.sort((a, b) => {
            const modifier = this.currentSort.order === 'asc' ? 1 : -1;
            if (this.currentSort.column === 'id') {
                return a.id.localeCompare(b.id) * modifier;
            } else if (this.currentSort.column === 'date') {
                const dateA = a.date.split('.').reverse().join('');
                const dateB = b.date.split('.').reverse().join('');
                return dateA.localeCompare(dateB) * modifier;
            }
            return a[this.currentSort.column].localeCompare(b[this.currentSort.column]) * modifier;
        });

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
            tableHeader.style.display = 'none';
        } else {
            emptyState.classList.add('hidden');
            tableHeader.style.display = 'flex';
            
            filtered.forEach(c => {
                const row = document.createElement('div');
                row.className = 'row-card';
                // Cały wiersz klikalny
                row.onclick = () => this.openDetails(c);
                row.innerHTML = `
                    <div class="col-id">${c.id}</div>
                    <div class="col-reporter">${c.reporter}</div>
                    <div class="col-product">${c.product}</div>
                    <div class="col-type">${c.type}</div>
                    <div class="col-date">${c.date}</div>
                    <div class="col-status">${c.statusHtml}</div>
                `;
                tbody.appendChild(row);
            });
        }
        
        this.updateSortIcons();
    },

    setSort: function(column) {
        if (this.currentSort.column === column) {
            this.currentSort.order = this.currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.column = column;
            this.currentSort.order = 'asc';
        }
        this.renderTable();
    },
    
    updateSortIcons: function() {
        document.querySelectorAll('.sort-icon').forEach(icon => {
            icon.style.opacity = '0.3';
            icon.innerHTML = '<path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>';
        });
        
        const activeIcon = document.getElementById(`sort-${this.currentSort.column}`);
        if(activeIcon) {
            activeIcon.style.opacity = '1';
            activeIcon.innerHTML = this.currentSort.order === 'asc' 
                ? '<path d="M7 15l5-5 5 5"/>' // up
                : '<path d="M7 9l5 5 5-5"/>'; // down
        }
    },

    resetFilters: function() {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-status').value = 'all';
        document.getElementById('filter-type').value = 'all';
        this.renderTable();
        this.showToast('Filtry zostały zresetowane.', 'success');
    },

    openDetails: function(complaint) {
        this.activeComplaintId = complaint.id;
        
        // Zmień teksty nagłówkowe i meta formularza
        document.getElementById('detail-id-header').innerText = `Zgłoszenie ${complaint.id}`;
        document.getElementById('detail-product-name').innerText = complaint.product;
        document.getElementById('detail-reporter').innerText = complaint.reporter;
        document.getElementById('detail-date').innerText = complaint.date;
        document.getElementById('detail-type').innerText = complaint.type;
        
        // Ustaw domyślne statusy w formularzu rozpatrywania
        document.getElementById('select-status').value = complaint.status;
        this.handleStatusChange();
        if(complaint.status === 'rozpatrzone') {
            document.getElementById('select-result').value = complaint.result || '';
        }

        // Sekcja notatek
        const notesTimeline = document.getElementById('notes-timeline');
        const emptyPlaceholder = document.getElementById('empty-notes-placeholder');
        
        if (complaint.hasNotes) {
            notesTimeline.classList.remove('hidden');
            emptyPlaceholder.classList.add('hidden');
        } else {
            notesTimeline.classList.add('hidden');
            emptyPlaceholder.classList.remove('hidden');
        }

        // Przełączanie sekcji UI
        // .active uaktywnia display:block
        document.getElementById('view-list').classList.remove('active');
        document.getElementById('view-details').classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    showListView: function() {
        document.getElementById('view-details').classList.remove('active');
        document.getElementById('view-list').classList.add('active');
    },

    // Obsługa dynamicznego pojawiania się pola "Rezultat"
    handleStatusChange: function() {
        const statusSelect = document.getElementById('select-status');
        const resolutionBlock = document.getElementById('resolution-block');
        const resultSelect = document.getElementById('select-result');
        
        if (statusSelect.value === 'rozpatrzone') {
            resolutionBlock.classList.remove('hidden');
        } else {
            resolutionBlock.classList.add('hidden');
            resultSelect.value = ""; // reset
        }
    },

    // Symulacja zapisu (Pokazanie Toast)
    saveChanges: function() {
        const statusSelect = document.getElementById('select-status');
        const resultSelect = document.getElementById('select-result');

        if (statusSelect.value === 'rozpatrzone' && !resultSelect.value) {
            this.showToast('Wybierz rezultat zgłoszenia (Uznane/Odrzucone) by zapisać.', 'error');
            return;
        }

        this.showToast('Zmiany zostały pomyślnie zapisane.', 'success');
        
        setTimeout(() => {
            this.showListView();
        }, 1200);
    },

    // Symulacja dodawania notatki
    addNote: function() {
        const textarea = document.querySelector('#note-textarea');
        if (!textarea.value.trim()) {
            this.showToast('Treść notatki nie może być pusta.', 'error');
            return;
        }

        this.showToast('Dodano nową notatkę.', 'success');
        
        // Zmień stan w obiekcie, żeby zapamiętać notatkę
        const complaint = this.complaints.find(c => c.id === this.activeComplaintId);
        if(complaint) {
            complaint.hasNotes = true;
        }

        textarea.value = '';

        // Odtwórz widok notatek
        document.getElementById('empty-notes-placeholder').classList.add('hidden');
        document.getElementById('notes-timeline').classList.remove('hidden');
    },

    // Komponent Toast / Snackbar
    showToast: function(message, type = 'success') {
        const container = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconSvg = type === 'success' 
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

        toast.innerHTML = `
            ${iconSvg}
            <span>${message}</span>
        `;
        
        container.appendChild(toast);

        // Usuwamy toast po animacji
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                if(toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        }, 3500);
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
