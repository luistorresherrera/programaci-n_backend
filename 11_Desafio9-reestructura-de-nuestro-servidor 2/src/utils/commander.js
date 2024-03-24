import { Command } from "commander";

const program = new Command();

program
  .option("--mode <mode>", "especificación de entorno", "production")
  .parse();

export default program;
