import TingleModal from "./TingleModal";

class ReadyModal extends TingleModal {
    constructor(props?) {
        super(Object.assign({
            closeMethods: [],
            onOpen: function () {
                console.log('modal open');
            },
            onClose: function () {
                console.log('modal closed');
            },
            beforeClose: function () {
                // here's goes some logic
                // e.g. save content before closing the modal
                return true; // close the modal
                // return false; // nothing happens
            }
        }, props));

        this.setContent(`
<div>
    <h1>準備完了！</h1>
</div>`);
    }
}

export default ReadyModal;
