import TingleModal from "./TingleModal";

class RoomCreationModal extends TingleModal {
    constructor(props?) {
        super(Object.assign({
            closeMethods: [],
            footer: true,
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
    <h1>ルーム作成中</h1>
</div>`);

        this.addFooterBtn("キャンセル", 'tingle-btn tingle-btn--primary', () => {
            this.close();
        });
    }
}

export default RoomCreationModal;
