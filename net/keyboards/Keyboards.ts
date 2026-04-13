import {Buttons} from "./Buttons";

export class Keyboards {

    static getPurchaseOptionKeyboard(purchaseId: string) {
        return {
            inline_keyboard: [
                [Buttons.editPurchase(purchaseId), Buttons.deletePurchase(purchaseId)]
            ]
        }
    }

    static getCommandListButtons() {
        return {
          inline_keyboard: [[Buttons.commands]]
        };
    }

    static getCompletedAddKeyboard(userId: number) {
        return {
            inline_keyboard: [[Buttons.addMore(userId), Buttons.history()]]
        }
    }

    static getDateKeyboard() {
        return {
          inline_keyboard: [
              [ Buttons.today, Buttons.yesterday ],
              [ Buttons.cancelPurchase ]
          ]
        };
    }

    static getCancelKeyboard() {
        return {
            inline_keyboard: [
                [ Buttons.cancelPurchase ]
            ]
        };
    }

    static getCancelEditKeyboard() {
        return {
            inline_keyboard: [
                [ Buttons.cancelEdit ]
            ]
        }
    }

    static getAddCategoryKeyboard() {
        return {
            inline_keyboard: [[ Buttons.cancelCategory ]]
        };
    }

    static getConfirmationInlineKeyboard(userId: number) {
        return {
            inline_keyboard: [
                [
                    { text: "✅ Save", callback_data: `add:${userId}` },
                    { text: "✏️ Edit", callback_data: "purchase_edit" }
                ],
                [
                    { text: "🗑️ Cancel", callback_data: "purchase_cancel" },
                    { text: "➕ Add category", callback_data: "purchase_add_category" }
                ]
            ]
        };
    }

    static getEditParameter() {
        return {
            inline_keyboard: [
                [
                    { text: "Name", callback_data: "edit_name" },
                ],
                [
                    { text: "Price", callback_data: "edit_price" }
                ],
                [
                    { text: "Date", callback_data: "edit_date" }
                ],
                [
                    Buttons.cancelEdit
                ]
            ]
        };
    }
}