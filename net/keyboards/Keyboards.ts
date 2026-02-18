import {InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton} from "node-telegram-bot-api";

export class Keyboards {
    static getCommandListButtons(): InlineKeyboardButton[][] {
        return [[{text: "Check commands", callback_data: "command_list"}]]
    }

    static getDateKeyboard(): KeyboardButton[][] {
        return [
            [
                {text: "Today"},
                {text: "Yesterday"}
            ],
            [
                {text: "Select date"}
            ],
            [
                {text: "❌ Cancel"}
            ]
        ]
    }

    static getCancel(): InlineKeyboardButton[][] {
        return [
            [ { text: "🗑️ Cancel", callback_data: "purchase_cancel" } ]
        ]
    }

    static getAddCategoryKeyboard(): InlineKeyboardButton[][] {
        return [
            [ { text: "🗑️ Cancel", callback_data: "cancel_category" } ]
        ]
    }

    static getConfirmationInlineKeyboard(userId: number): InlineKeyboardButton[][] {
        return [
            [
                { text: "✅ Save", callback_data: `purchase_confirm:${userId}` },
                { text: "✏️ Edit", callback_data: "purchase_edit" }
            ],
            [
                { text: "🗑️ Cancel", callback_data: "purchase_cancel" },
                { text: "➕ Add category", callback_data: "purchase_add_category" }
            ]
        ]
    }

    static getEditInlineKeyboard(): InlineKeyboardButton[][] {
        return [
            [
                { text: "✏️ Name", callback_data: "edit_name" },
                { text: "💰 Price", callback_data: "edit_price" }
            ],
            [
                { text: "📅 Date", callback_data: "edit_date" },
                { text: "🏷️ Tag", callback_data: "edit_tag" }
            ],
            [
                { text: "✅ Save", callback_data: "edit_done" },
                { text: "❌ Undo", callback_data: "edit_cancel" }
            ]
        ];
    }
}