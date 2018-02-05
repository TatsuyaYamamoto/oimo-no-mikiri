import TingleModal from "./TingleModal";

class JoinModal extends TingleModal {
    constructor(roomId) {
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
    <h1>ルームID ${roomId}に参加します。</h1>
</div>`);
    }
}

export default JoinModal;
