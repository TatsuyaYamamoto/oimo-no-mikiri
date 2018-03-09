import { copyTextToClipboard } from "../../framework/utils";

import SweetAlert from "sweetalert2";
import * as tippy from "tippy.js";
import { showTweetView } from "./network";

export function closeModal() {
    SweetAlert.close();
}

export function openCreateRoomModal(url: string) {
    const alert = SweetAlert({
        title: "ルームを作成しました。",
        text: `招待用URLからゲームにアクセスすることで、対戦が行えます。`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });

    const baseButton = document.createElement("button");
    baseButton.classList.add("swal2-styled");
    baseButton.style.cssText = "padding: 0.4em;";

    const copyButton = <HTMLButtonElement>baseButton.cloneNode();
    copyButton.textContent = "URLをコピーする";
    copyButton.classList.add("swal2-confirm");
    copyButton.addEventListener("click", () => {
        copyTextToClipboard(url);
    });

    const tweetButton = <HTMLButtonElement>baseButton.cloneNode();
    tweetButton.textContent = "Twitterで招待する";
    tweetButton.classList.add("swal2-confirm");
    tweetButton.addEventListener("click", () => {
        showTweetView("ゲームしよう！", url);
    });

    const cancelButton = <HTMLButtonElement>baseButton.cloneNode();
    cancelButton.textContent = "キャンセル";
    cancelButton.classList.add("swal2-cancel");
    cancelButton.addEventListener("click", () => {
        closeModal();
    });

    const alertActions = document.querySelectorAll(".swal2-actions")[0];
    alertActions.setAttribute("style", "display: flex;");
    alertActions.appendChild(copyButton);
    alertActions.appendChild(tweetButton);
    alertActions.appendChild(cancelButton);

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

export function openWaitingRestartModal(){
    return SweetAlert({
        title: `対戦相手をまちますお`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}

export function openRestartConfirmModal(){
    return SweetAlert({
        title: `対戦相手が`,
        showConfirmButton: true,
        showCancelButton: true,
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
