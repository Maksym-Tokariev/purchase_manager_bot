export class Keyboards {
    static getCommandListButtons() {
        return {
          inline_keyboard: [[{text: "Check commands", callback_data: "command_list"}]]
        };
    }

    static getDateKeyboard() {
        return {
          inline_keyboard: [
              [
                  {text: "Today", callback_data: "today"},
                  {text: "Yesterday", callback_data: "yesterday"}
              ],
              [
                  {text: "🗑️ Cancel"}
              ]
          ]
        };
    }

    static getCancelKeyboard() {
        return {
            inline_keyboard: [
                [ { text: "🗑️ Cancel", callback_data: "purchase_cancel" } ]
            ]
        }
    }

    static getAddCategoryKeyboard() {
        return {
            inline_keyboard: [[ { text: "🗑️ Cancel", callback_data: "cancel_category" } ]]
        }
    }

    static getConfirmationInlineKeyboard(userId: number) {
        return {
            inline_keyboard: [
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
    }

    static getEditInlineKeyboard() {
        return {
            inline_keyboard: [
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
            ]
        };
    }
}