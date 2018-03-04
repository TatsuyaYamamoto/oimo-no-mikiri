import TingleModal from "./TingleModal";

class JoinModal extends TingleModal {
    constructor(props?) {
        super(Object.assign({}, props, {
            closeMethods: [],
        }));

        this.setContent(`
<div>
    <h1>メンバーがルームを退出しました。タイトル画面に戻ります。</h1>
</div>`);
    }
}

export default JoinModal;
