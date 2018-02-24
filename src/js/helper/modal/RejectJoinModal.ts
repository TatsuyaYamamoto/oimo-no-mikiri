import TingleModal from "./TingleModal";
import { copyTextToClipboard } from "../../../framework/utils";

class WaitingJoinModal extends TingleModal {
    constructor(props?) {
        super(Object.assign({
            closeMethods: [],
            footer: true,
        }, props));

        this.setContent(`
<div>
    <h1>ルームに参加できませんでした。</h1>
</div>`);
        this.addFooterBtn("キャンセル", 'tingle-btn tingle-btn--primary', () => {
            this.close();
        });
    }
}

export default WaitingJoinModal;
