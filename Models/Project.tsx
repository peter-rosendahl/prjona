export interface IProject {
    
    name: string;
    limit: number;
    counter: number;
    note: string;

    
}

export interface ICurrentProject extends IProject {
    isCurrent?: boolean;
}

export class CurrentProject implements ICurrentProject {
    isCurrent?: boolean;
    name: string;
    limit: number;
    counter: number;
    note: string;

    /**
     * Creates a new Prjona project to store on local storage.
     * @param name name of the project.
     * @param limit limit of the project counter.
     * @param counter the current counter value of the project.
     * @param note the note of the project.
     */
    constructor(name: string, limit: number, counter: number, note: string) {
        this.name = name;
        this.limit = limit;
        this.counter = counter;
        this.note = note;
        this.isCurrent = true;
    }
}