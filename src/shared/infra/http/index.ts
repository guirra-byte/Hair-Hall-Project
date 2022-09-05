import { app } from "../../../app";

const _PORT: number = 1122;

app.listen(_PORT,
  () => console.log(`O Server já está rodando na Porta: ${_PORT}`));