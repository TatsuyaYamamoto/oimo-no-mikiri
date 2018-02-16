import TingleModal from "./TingleModal";

class ReadyModal extends TingleModal {
    constructor(props?) {
        super(Object.assign({
            closeMethods: [],
        }, props));

        this.setContent(`
<div>
    <h1>準備完了！</h1>
</div>`);
    }
}

export default ReadyModal;
