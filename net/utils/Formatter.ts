export class Formatter {

    public static stripCommand(input: string): string {
        let result: string = "";
         const indexOfSpace = input.indexOf(" ");
         result += input.substring(indexOfSpace, input.length).trim();

        return result;
    }

}