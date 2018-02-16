import TingleModal from "./TingleModal";

class JoinModal extends TingleModal {
    constructor(roomId, props?) {
        super(Object.assign({
            closeMethods: [],
        }, props));

        this.setContent(`
<div>
    <h1>ルームID ${roomId}に参加します。</h1>
</div>`);
    }
}

export default JoinModal;
