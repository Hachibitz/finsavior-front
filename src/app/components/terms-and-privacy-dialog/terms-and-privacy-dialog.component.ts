import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditTableDialogComponent } from '../edit-table-dialog/edit-table-dialog.component';

@Component({
  selector: 'app-terms-and-privacy-dialog',
  templateUrl: './terms-and-privacy-dialog.component.html',
  styleUrls: ['./terms-and-privacy-dialog.component.scss']
})
export class TermsAndPrivacyDialogComponent {
  public contentTitle: string;
  public contentText: string;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TermsAndPrivacyDialogComponent>
  ) {
    this.contentTitle = data.type === 'privacy' ? 'Política de Privacidade' : 'Termos e Condições';
    this.contentText = data.type === 'privacy' ? this.getPrivacyPolicy() : this.getTermsAndConditions();
  }

  onSave() {
    this.dialogRef.close('salvar');
  }

  onCancel() {
    this.dialogRef.close();
  }

  private getTermsAndConditions(): string {
    return `
      <p><strong>Termos e Condições de Uso do FinSavior</strong></p>
      <ol>
        <li><strong>1. Introdução</strong></li>
        <p>Bem-vindo ao FinSavior! Esses Termos e Condições ("Termos") regem o uso de nossa aplicação disponível via web, iOS e Android. Ao se cadastrar e utilizar nossos serviços, você concorda com estes Termos. Leia atentamente antes de usar o FinSavior.</p>
        
        <li><strong>2. Definições</strong></li>
        <p><strong>2.1. Aplicação:</strong> Refere-se ao FinSavior.</p>
        <p><strong>2.2. Usuário:</strong> Qualquer pessoa que se cadastre e utilize a aplicação.</p>
        <p><strong>2.3. Dados do Usuário:</strong> Informações fornecidas pelo usuário, incluindo nome, email, nome de usuário, senha e dados de contas registradas.</p>
        <p><strong>2.4. Contas Registradas:</strong> Incluem contas de ativo, passivo, caixa, poupança, etc.</p>
        <p><strong>2.5. Serviços:</strong> Funcionalidades oferecidas pelo FinSavior, incluindo a assinatura para liberar mais recursos de IA.</p>
        
        <li><strong>3. Cadastro e Conta do Usuário</strong></li>
        <p><strong>3.1. </strong>Para utilizar o FinSavior, você deve se cadastrar fornecendo informações precisas e completas, como nome, email, nome de usuário e senha.</p>
        <p><strong>3.2. </strong>Você é responsável por manter a confidencialidade das suas credenciais de login e por todas as atividades que ocorram na sua conta.</p>
        <p><strong>3.3. </strong>Caso suspeite de qualquer uso não autorizado da sua conta, entre em contato conosco imediatamente.</p>
        
        <li><strong>4. Dados das Contas Registradas</strong></li>
        <p><strong>4.1. </strong>Você pode cadastrar e gerenciar diversas contas financeiras na aplicação, como contas de ativo, passivo, caixa, poupança, entre outras.</p>
        <p><strong>4.2. </strong>Os dados das contas são utilizados para gerar conselhos da IA e são compartilhados com uma API de terceiros para análise.</p>
        
        <li><strong>5. Pagamentos e Assinatura</strong></li>
        <p><strong>5.1. </strong>A aplicação oferece uma assinatura paga para liberar mais recursos de IA.</p>
        <p><strong>5.2. </strong>Os pagamentos são processados diretamente pelo PayPal, não armazenamos informações de pagamento como números de cartão de crédito.</p>
        <p><strong>5.3. </strong>Ao contratar a assinatura, você concorda com os termos de pagamento do PayPal.</p>
        
        <li><strong>6. Privacidade e Segurança</strong></li>
        <p><strong>6.1. </strong>Tratamos a privacidade dos seus dados com seriedade. Consulte nossa Política de Privacidade para mais informações sobre como coletamos, utilizamos e protegemos seus dados pessoais.</p>
        <p><strong>6.2. </strong>Embora adotemos medidas de segurança para proteger seus dados, não podemos garantir segurança absoluta. Você reconhece e aceita esse risco ao usar a aplicação.</p>
        
        <li><strong>7. Uso da IA e Compartilhamento de Dados</strong></li>
        <p><strong>7.1. </strong>A IA do FinSavior fornece conselhos com base nos dados das suas contas.</p>
        <p><strong>7.2. </strong>Ao utilizar a aplicação, você consente que seus dados sejam compartilhados com a API de terceiros para análise.</p>
        
        <li><strong>8. Responsabilidades e Limitações</strong></li>
        <p><strong>8.1. </strong>O FinSavior é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas.</p>
        <p><strong>8.2. </strong>Não garantimos que a aplicação estará sempre disponível ou livre de erros.</p>
        <p><strong>8.3. </strong>Não seremos responsáveis por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou da incapacidade de usar a aplicação.</p>

        <li><strong>9. Modificações dos Termos</strong></li>
        <p><strong>9.1. </strong>Podemos atualizar estes Termos de tempos em tempos. Notificaremos sobre alterações significativas através do nosso site ou por email.</p>
        <p><strong>9.2. </strong>O uso continuado da aplicação após a publicação das alterações constitui sua aceitação dos novos Termos.</p>
        
        <li><strong>10. Cancelamento e Encerramento de Conta</strong></li>
        <p><strong>10.1. </strong>Você pode cancelar sua conta a qualquer momento através das configurações da aplicação.</p>
        <p><strong>10.2. </strong>Reservamo-nos o direito de encerrar ou suspender sua conta a nosso critério, especialmente em caso de violação destes Termos.</p>
        
        <li><strong>11. Disposições Gerais</strong></li>
        <p><strong>11.1. </strong>Estes Termos são regidos pelas leis do país onde a FinSavior está registrada.</p>
        <p><strong>11.2. </strong>Caso qualquer disposição destes Termos seja considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.</p>
        
        <li><strong>12. Contato</strong></li>
        <p>Se você tiver dúvidas sobre estes Termos, entre em contato conosco através do email: suporte@finsavior.com.</p>
        
        <p>Obrigado por escolher o FinSavior!</p>
      </ol>`;
  }

  private getPrivacyPolicy(): string {
    return `
      <p><strong>Política de Privacidade do FinSavior</strong></p>
      <ol>
        <li><strong>1. Introdução</strong></li>
        <p>A sua privacidade é importante para nós. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos as informações pessoais fornecidas pelos usuários do FinSavior. Ao utilizar nossa aplicação, você concorda com as práticas descritas nesta política.</p>
  
        <li><strong>2. Informações Coletadas</strong></li>
        <p><strong>2.1. Informações de Cadastro:</strong> Ao se cadastrar no FinSavior, coletamos seu nome, email, nome de usuário e senha.</p>
        <p><strong>2.2. Dados das Contas Registradas:</strong> Incluem informações sobre suas contas financeiras, como contas de ativo, passivo, caixa, poupança, entre outras.</p>
        <p><strong>2.3. Dados de Uso:</strong> Coletamos informações sobre como você utiliza a aplicação, incluindo interações com nossos serviços e preferências de uso.</p>
        <p><strong>2.4. Informações de Pagamento:</strong> Embora os pagamentos sejam processados diretamente pelo PayPal e não armazenamos informações de cartão de crédito, coletamos dados necessários para gerenciar sua assinatura.</p>
  
        <li><strong>3. Uso das Informações</strong></li>
        <p><strong>3.1. Fornecimento de Serviços:</strong> Utilizamos suas informações para fornecer e melhorar os serviços oferecidos pelo FinSavior, incluindo a geração de conselhos da IA.</p>
        <p><strong>3.2. Análises e Relatórios:</strong> Compartilhamos dados das contas registradas com uma API de terceiros para análise e geração de relatórios financeiros personalizados.</p>
        <p><strong>3.3. Comunicações:</strong> Enviamos comunicações relevantes sobre sua conta, atualizações de serviços e informações promocionais, se você tiver consentido em recebê-las.</p>
        <p><strong>3.4. Segurança e Conformidade:</strong> Utilizamos informações para monitorar e melhorar a segurança da aplicação e garantir conformidade com nossas políticas e obrigações legais.</p>
  
        <li><strong>4. Compartilhamento de Informações</strong></li>
        <p><strong>4.1. Provedores de Serviços Terceirizados:</strong> Compartilhamos informações com terceiros que nos auxiliam na prestação dos serviços, como a API de análise financeira.</p>
        <p><strong>4.2. Conformidade Legal:</strong> Podemos divulgar suas informações para cumprir obrigações legais, responder a processos judiciais ou proteger nossos direitos e propriedades.</p>
        <p><strong>4.3. Consentimento:</strong> Compartilhamos informações com outros terceiros conforme descrito no momento em que você fornecer seu consentimento.</p>
  
        <li><strong>5. Proteção das Informações</strong></li>
        <p><strong>5.1. Medidas de Segurança:</strong> Implementamos medidas de segurança técnicas e administrativas para proteger suas informações contra acesso, uso, alteração e divulgação não autorizados.</p>
        <p><strong>5.2. Retenção de Dados:</strong> Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, exceto se exigido de outra forma por lei.</p>
  
        <li><strong>6. Seus Direitos</strong></li>
        <p><strong>6.1. Acesso e Correção:</strong> Você tem o direito de acessar e corrigir suas informações pessoais a qualquer momento através das configurações da sua conta.</p>
        <p><strong>6.2. Exclusão de Dados:</strong> Você pode solicitar a exclusão de suas informações pessoais. No entanto, algumas informações podem ser retidas conforme necessário para cumprir obrigações legais ou resolver disputas.</p>
        <p><strong>6.3. Cancelamento de Assinaturas:</strong> Você pode optar por não receber comunicações promocionais a qualquer momento, seguindo as instruções de cancelamento de inscrição fornecidas nas comunicações.</p>
  
        <li><strong>7. Crianças</strong></li>
        <p><strong>7.1. Uso por Menores:</strong> Nossa aplicação não é destinada a crianças menores de 13 anos. Não coletamos intencionalmente informações pessoais de crianças. Se tomarmos conhecimento de que coletamos informações pessoais de uma criança menor de 13 anos sem verificação do consentimento dos pais, tomaremos medidas para excluir essas informações.</p>
  
        <li><strong>8. Alterações a esta Política de Privacidade</strong></li>

        <p><strong>8.1. Atualizações:</strong> Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas por meio do nosso site ou por email.</p>
        <p><strong>8.2. Aceitação das Alterações:</strong> O uso continuado da aplicação após a publicação das alterações constitui sua aceitação das novas práticas de privacidade.</p>

        <li><strong>9. Contato</strong></li>
        <p>Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade, entre em contato conosco através do email: suporte@finsavior.com.</p>

        <p>Obrigado por confiar no FinSavior!</p>
      </ol>`;
  }
}
