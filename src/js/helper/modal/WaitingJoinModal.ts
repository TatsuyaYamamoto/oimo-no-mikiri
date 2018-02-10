import TingleModal from "./TingleModal";

class WaitingJoinModal extends TingleModal {
    constructor(url, props?) {
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
