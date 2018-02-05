import { modal as Tingle } from "tingle.js";
import "tingle.js/dist/tingle.css";

abstract class TingleModal extends Tingle {
    constructor(modalProps) {
        super(modalProps);
    }

    public open() {
        super.open();
    }

    public close() {
        super.close();
    }

    public setContent(content: string) {
        super.setContent(content);
    }

    public addFooterBtn(label: string, classes: string, callback: Function) {
        super.addFooterBtn(label, classes, callback);
    }
}

export default TingleModal;
