# Telegram bot for tracking purchases

The bot is designed to keep track of your purchases and let you view them.
The bot features a ready-to-use, pattern-based, extensible 
architecture—comprising strategies, observers and states—which can be easily 
expanded or modified

## Quick Start

First, you need to create a new `.env` file containing your database (MongoDB) settings

### Installation and start

```bash
git clone https://github.com/Maksym-Tokariev/purchase_manager_bot.git
npm ts-node net/Starter.ts
```

### Usage

When you launch your bot based on this logic, it will perform a simple function: 
accepting purchases from users, entering them into the 
database, and retrieving them on request.
You can view the list of commands in the `config/Commands.ts` file. 
There, you can add a command; you will then need to register it in 
`services/CommandRegistry.ts` and add the corresponding strategy to the strategies 
directory, inheriting it from BaseStrategy, and to the strategies array in 
the `strategies/StrategyFactory.ts` file.    

To define a strategy in the `canHandle` method, 
you need to specify the condition under which your strategy should be executed, 
for example, `StartStrategy.ts` is executed when the user enters `/start`:
```ts
async canHandle(event: IInputSource): Promise<Optional<boolean>> {
    if (event.text) {
        return event.text.includes('/start');
    }
    return false;
}
```
To add new buttons, you need to 
create a static method in the `keyboards/Buttons.ts` file. 
You can then add these buttons to the keyboard in the `Keyboards.ts` file.

New classes must be added to `ServiceContainer.ts`.
