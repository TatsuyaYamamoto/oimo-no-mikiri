import SweetAlert from "sweetalert2";
import * as tippy from "tippy.js";
import { copyTextToClipboard } from "../../framework/utils";
import { showTweetView } from "./network";

export function closeModal() {
    SweetAlert.close();
}

export function openCreateRoomModal(gameId: string) {
    const url = `${location.protocol}//${location.host}${location.pathname}?gameId=${gameId}`;

    SweetAlert({
        title: "ルームを作成しました！",
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
    copyButton.id = "button-create-room-copy-url";
    copyButton.classList.add("swal2-confirm");
    copyButton.setAttribute("title", "コピーが完了しました");

    const tweetButton = <HTMLButtonElement>baseButton.cloneNode();
    tweetButton.textContent = "Twitterで招待する";
    tweetButton.classList.add("swal2-confirm");

    const cancelButton = <HTMLButtonElement>baseButton.cloneNode();
    cancelButton.textContent = "キャンセル";
    cancelButton.classList.add("swal2-cancel");

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

    return new Promise((resolve, reject) => {
        copyButton.addEventListener("click", () => {
            copyTextToClipboard(url);
        });
        tweetButton.addEventListener("click", () => {
            showTweetView("ゲームしよう！", url);
        });
        cancelButton.addEventListener("click", () => {
            resolve("cancel")
        });
    });
}

export function openJoinRoomModal(roomId) {
    return SweetAlert({
        title: `ゲームに参加します！`,
        text: `ID: ${roomId}`,
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

export function openRejectJoinRoomModal(type) {
    let text = "予期しないエラーが発生してしまいました。";

    switch (type) {
        case "already_fulfilled":
            text = "対戦メンバーが決定済みのため、ゲームに参加できませんでした。";
            break;
        case "no_game":
            text = "作成されていない、または削除済みのゲームでした。";
            break;
    }

    return SweetAlert({
        text,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}

export function openWaitingRestartModal() {
    return SweetAlert({
        title: `対戦相手を入力待っています！`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}

export function openRestartConfirmModal() {
    return SweetAlert({
        title: `対戦相手がもう1度ゲームを始めようとしています！`,
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}

export function openMemberLeftModal() {
    return SweetAlert({
        title: `メンバーがルームを退出しました！`,
        text: "タイトル画面に戻ります。",
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}

export function openConfirmCloseGameModal() {
    return SweetAlert({
        title: `ゲームをキャンセルしますか？`,
        text: "キャンセルすると対戦相手の受付が行えなくなります。",
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: "やっぱりしない！",
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: "キャンセルする...。",
        reverseButtons: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
}
