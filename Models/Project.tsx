export class Project {
    
    public name: string;
    public limit: number;
    public counter: number;
    public note: string;

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
    }
}