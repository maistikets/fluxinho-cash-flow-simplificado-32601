# FinanceApp Mobile

## Configuração Capacitor

O projeto já está configurado com Capacitor para funcionar como aplicativo móvel nativo.

## Como testar no dispositivo físico ou emulador

### Pré-requisitos
- Node.js instalado
- Git
- Android Studio (para Android)
- Xcode (para iOS - apenas Mac)

### Passo a passo

1. **Transferir para seu GitHub**
   - Clique no botão "Export to Github" no Lovable
   - Clone o projeto: `git clone [seu-repositorio]`

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Adicionar plataformas**
   ```bash
   # Para Android
   npx cap add android
   
   # Para iOS (apenas Mac)
   npx cap add ios
   ```

4. **Atualizar dependências nativas**
   ```bash
   npx cap update android
   # ou
   npx cap update ios
   ```

5. **Build do projeto**
   ```bash
   npm run build
   ```

6. **Sincronizar com as plataformas nativas**
   ```bash
   npx cap sync
   ```

7. **Executar no dispositivo/emulador**
   ```bash
   # Android
   npx cap run android
   
   # iOS
   npx cap run ios
   ```

## Funcionalidades Mobile

- **Menu lateral responsivo**: Colapsa automaticamente em dispositivos móveis
- **Interface otimizada**: Tamanhos de fonte e espaçamentos ajustados para telas menores
- **Tabelas scrolláveis**: Rolagem horizontal automática para tabelas em telas pequenas
- **Botões de toque**: Tamanhos mínimos de 44px para melhor usabilidade
- **Headers fixos**: Navegação sempre acessível no mobile

## Notas importantes

- O menu lateral se fecha automaticamente após a navegação no mobile
- As tabelas têm scroll horizontal para preservar todas as colunas
- Os cartões de métricas se ajustam automaticamente ao tamanho da tela
- Formulários são otimizados para teclados móveis

## Desenvolvimento

Para desenvolvimento contínuo:
1. Faça suas alterações no código
2. Execute `npm run build`
3. Execute `npx cap sync` para sincronizar as mudanças
4. Execute `npx cap run [platform]` para testar

## Recursos adicionais

Para mais informações sobre desenvolvimento mobile com Capacitor:
- [Documentação oficial do Capacitor](https://capacitorjs.com/docs)
- [Guia de desenvolvimento iOS](https://capacitorjs.com/docs/ios)
- [Guia de desenvolvimento Android](https://capacitorjs.com/docs/android)