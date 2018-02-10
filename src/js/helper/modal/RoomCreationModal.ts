import TingleModal from "./TingleModal";

class RoomCreationModal extends TingleModal {
    constructor(props?) {
        super(Object.assign({
            closeMethods: [],
            footer: true,
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
