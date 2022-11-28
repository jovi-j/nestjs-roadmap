-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "finalizado" BOOLEAN NOT NULL DEFAULT false,
    "pessoaId" INTEGER,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_nome_key" ON "Pessoa"("nome");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
