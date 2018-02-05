import TingleModal from "./TingleModal";

class RoomCreationModal extends TingleModal {
    constructor() {
        super({
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
        });

        this.setContent(`
<div>
    <h1>ルーム作成中</h1>
    <button class="tingle-btn">キャンセル</button>
</div>`);
    }
}

export default RoomCreationModal;
