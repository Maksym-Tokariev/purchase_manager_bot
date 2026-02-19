export class Buttons {

    public static get today() {
        return {text: "Today", callback_data: "today"};
    }

    public static get yesterday() {
        return {text: "Yesterday", callback_data: "yesterday"};
    }

    public static get cancelPurchase() {
        return {text: "🗑️ Cancel", callback_data: "purchase_cancel"};
    }

    public static get cancelCategory() {
        return {text: "🗑️ Cancel", callback_data: "cancel_category"};
    }

    public static get commands() {
        return {text: "Check commands", callback_data: "command_list"};
    }

}