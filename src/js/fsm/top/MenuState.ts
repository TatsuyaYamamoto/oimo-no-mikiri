import ViewContainer from "../../../framework/ViewContainer";
import Deliverable from "../../../framework/Deliverable";

import SelectPlayerNumberBoard from "../../texture/containers/SelectPlayerNumberBoard";

class MenuState extends ViewContainer {
    public static TAG = MenuState.name;

    private _selectPlayerNumberBoard: SelectPlayerNumberBoard;

    /**
     * @override
     */
    onEnter(params: Deliverable): void {
        super.onEnter(params);

        this._selectPlayerNumberBoard = new SelectPlayerNumberBoard();
        this._selectPlayerNumberBoard.position.set(this.viewWidth * 0.5, this.viewHeight * 0.8);
        this._selectPlayerNumberBoard.setOnSelectOnePlayerListener(this._onSelectOnePlayer);
        this._selectPlayerNumberBoard.setOnSelectTwoPlayerListener(this._onSelectTwoPlayer);

        this.applicationLayer.addChild(
            this._selectPlayerNumberBoard,
        )
    }

    /**
     * @override
     */
    onExit(): void {
        super.onExit();
    }

    /**
     *
     * @private
     */
    private _onSelectOnePlayer = () => {
        this.applicationLayer.removeChild(
            this._selectPlayerNumberBoard,
        );
    };

    /**
     *
     * @private
     */
    private _onSelectTwoPlayer = () => {
        // TODO: implement.
    };

}

export default MenuState;
