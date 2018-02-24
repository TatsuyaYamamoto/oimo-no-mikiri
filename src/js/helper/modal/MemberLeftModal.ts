import TingleModal from "./TingleModal";

class JoinModal extends TingleModal {
    constructor(props?) {
        super(props);

        this.setContent(`
<div>
    <h1>メンバーがルームを退出しました。リロードします。</h1>
</div>`);
    }
}

export default JoinModal;
