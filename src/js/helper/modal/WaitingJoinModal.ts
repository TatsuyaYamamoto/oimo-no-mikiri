import TingleModal from "./TingleModal";

class WaitingJoinModal extends TingleModal {
    constructor(url, props?) {
        super(Object.assign({
            closeMethods: [],
            footer: true,
        }, props));

        this.setContent(`
<div>
    <h1>メンバー待機中</h1>
    <span>URL: ${url}</span>
</div>`);

        this.addFooterBtn("クリッポボード", 'tingle-btn tingle-btn--primary', () => {
        });

        this.addFooterBtn("ツイッター", 'tingle-btn tingle-btn--primary', () => {
            this.close();
        });

        this.addFooterBtn("キャンセル", 'tingle-btn tingle-btn--primary', () => {
            this.close();
        });
    }
}

export default WaitingJoinModal;
