import { copyTextToClipboard } from "../../framework/utils";

import SweetAlert from "sweetalert2";
import * as tippy from "tippy.js";

export function closeModal() {
    SweetAlert.close();
}

export function openCreateRoomModal(url: string) {
    const alert = SweetAlert({
        title: "ルームを作成します！",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
    const alertActions = document.querySelectorAll(".swal2-actions")[0];
    alertActions.setAttribute("style", "display: flex;");
    alertActions.innerHTML = `
        <button class="swal2-confirm swal2-styled" id="button-create-room-copy-url" title="I'm a tooltip!">URLをコピーする</button>
        <button class="swal2-confirm swal2-styled" id="button-create-room-tweet">ツイートする</button>
        <button class="swal2-cancel swal2-styled"  id="button-create-room-cancel">キャンセル</button>
    `;

    const copyButton = document.createElement("button");
    copyButton.classList.add("swal2-styled", "swal2-confirm");
    copyButton.addEventListener("click", () => {
        copyTextToClipboard(url);
    });

    const tweetButton = document.getElementById("button-create-room-tweet");
    tweetButton.addEventListener("click", () => {
        const url = "http://example.com/";
        window.open(url);
    });

    const cancelButton = document.getElementById("button-create-room-cancel");
    cancelButton.addEventListener("click", () => {
        closeModal();
    });

    (<HTMLDivElement>document.querySelectorAll(".swal2-styled").item(0)).style.cssText = `
        margin: 10px;
    `;

    tippy("#button-create-room-copy-url", {
        trigger: "click",
        arrow: true,
        onShow(instance) {
            setTimeout(() => instance.hide(), 1500);
        },
    });

    return alert;
}

export function openJoinRoomModal(roomId) {
    return SweetAlert({
        title: `${roomId}に参加します`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}

export function openReadyRoomModal() {
    return SweetAlert({
        title: `準備完了`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}

export function openRejectJoinRoomModal(roomId) {
    return SweetAlert({
        title: `${roomId}に参加できませんでした`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}

export function openMemberLeftModal() {
    return SweetAlert({
        title: `メンバーがルームを退出しました。タイトル画面に戻ります。`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}
