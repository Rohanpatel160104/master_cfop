
export class Store extends EventTarget {
    constructor() {
        super();
        this.userData = this.loadData();
    }

    loadData() {
        try {
            const stored = localStorage.getItem('algcubing_data');
            const parsed = stored ? JSON.parse(stored) : null;
            
            if (!parsed) return { favorites: {}, customAlgs: {}, learned: [], history: [] };

            return {
                favorites: parsed.favorites || {},
                customAlgs: parsed.customAlgs || {},
                learned: parsed.learned || [],
                history: parsed.history || []
            };
        } catch {
            return { favorites: {}, customAlgs: {}, learned: [], history: [] };
        }
    }

    save() {
        localStorage.setItem('algcubing_data', JSON.stringify(this.userData));
        this.dispatchEvent(new Event('update'));
    }

    toggleFavorite(caseId, alg) {
        if (this.userData.favorites[caseId] === alg) {
            delete this.userData.favorites[caseId];
        } else {
            this.userData.favorites[caseId] = alg;
        }
        this.save();
    }

    toggleLearned(caseId) {
        if (this.userData.learned.includes(caseId)) {
            this.userData.learned = this.userData.learned.filter(id => id !== caseId);
        } else {
            this.userData.learned.push(caseId);
        }
        this.save();
    }

    addCustomAlg(caseId, alg) {
        if (!this.userData.customAlgs[caseId]) {
            this.userData.customAlgs[caseId] = [];
        }
        this.userData.customAlgs[caseId].push(alg);
        this.save();
    }

    removeCustomAlg(caseId, alg) {
        if (this.userData.customAlgs[caseId]) {
            this.userData.customAlgs[caseId] = this.userData.customAlgs[caseId].filter(a => a !== alg);
            if (this.userData.favorites[caseId] === alg) {
                delete this.userData.favorites[caseId];
            }
            this.save();
        }
    }

    addHistoryRecord(record) {
        this.userData.history.unshift(record);
        this.save();
    }
    
    deleteHistoryRecord(id) {
        this.userData.history = this.userData.history.filter(r => r.id !== id);
        this.save();
    }
}
