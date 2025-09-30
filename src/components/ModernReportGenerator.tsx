import React, { useState } from 'react';
import { Transaction } from '@/types/financial';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, FileText, Calendar, TrendingUp, TrendingDown, DollarSign, Eye } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import ReportPreview from '@/components/ReportPreview';

interface ModernReportGeneratorProps {
  transactions: Transaction[];
}

const ModernReportGenerator: React.FC<ModernReportGeneratorProps> = ({ transactions }) => {
  const [reportType, setReportType] = useState<'monthly' | 'custom'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showPreview, setShowPreview] = useState(false);

  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    if (reportType === 'monthly') {
      const start = startOfMonth(selectedMonth);
      const end = endOfMonth(selectedMonth);
      filtered = transactions.filter(t => {
        const date = new Date(t.dueDate);
        return date >= start && date <= end;
      });
    } else if (reportType === 'custom' && startDate && endDate) {
      filtered = transactions.filter(t => {
        const date = new Date(t.dueDate);
        return date >= startDate && date <= endDate;
      });
    }
    
    return filtered;
  };

  const generateCleanPDF = () => {
    const filteredTransactions = getFilteredTransactions();
    const doc = new jsPDF();
    
    // Helper functions to match preview formatting
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('pt-BR');
    };

    // Calculate totals
    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    // Header - exactly like preview
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Financeiro - Fluxinho', 105, 25, { align: 'center' });
    
    // Period info - exactly like preview
    const period = reportType === 'monthly' 
      ? format(selectedMonth, 'MMMM yyyy', { locale: ptBR })
      : `${startDate ? formatDate(startDate.toISOString()) : 'Início'} até ${endDate ? formatDate(endDate.toISOString()) : 'Hoje'}`;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Período: ${period}`, 105, 35, { align: 'center' });

    let yPosition = 50;

    // Summary section - matching preview layout with colored boxes
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro', 20, yPosition);
    yPosition += 20;

    // Create colored boxes like in preview
    // Green box for income
    doc.setFillColor(220, 252, 231); // Light green
    doc.rect(20, yPosition, 50, 25, 'F');
    doc.setTextColor(21, 128, 61); // Dark green
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(totalIncome), 45, yPosition + 10, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Total de Receitas', 45, yPosition + 18, { align: 'center' });

    // Red box for expenses
    doc.setFillColor(254, 226, 226); // Light red
    doc.rect(80, yPosition, 50, 25, 'F');
    doc.setTextColor(185, 28, 28); // Dark red
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(totalExpenses), 105, yPosition + 10, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Total de Despesas', 105, yPosition + 18, { align: 'center' });

    // Blue/Orange box for balance
    const balanceColor = balance >= 0 ? [219, 234, 254] : [255, 237, 213]; // Light blue or light orange
    const balanceTextColor = balance >= 0 ? [29, 78, 216] : [194, 65, 12]; // Dark blue or dark orange
    doc.setFillColor(balanceColor[0], balanceColor[1], balanceColor[2]);
    doc.rect(140, yPosition, 50, 25, 'F');
    doc.setTextColor(balanceTextColor[0], balanceTextColor[1], balanceTextColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(balance), 165, yPosition + 10, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Saldo Final', 165, yPosition + 18, { align: 'center' });

    yPosition += 40;

    // Reset text color to black
    doc.setTextColor(0, 0, 0);

    // Transactions table - exactly like preview
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Transações (${filteredTransactions.length})`, 20, yPosition);
    yPosition += 15;

    // Table header - matching preview styling
    doc.setFillColor(249, 250, 251); // Light gray background
    doc.rect(20, yPosition, 170, 8, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81); // Gray text
    doc.text('Data', 25, yPosition + 5);
    doc.text('Descrição', 50, yPosition + 5);
    doc.text('Categoria', 100, yPosition + 5);
    doc.text('Valor', 140, yPosition + 5);
    doc.text('Status', 170, yPosition + 5);
    yPosition += 12;

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Table rows - exactly like preview
    filteredTransactions.forEach((transaction, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;
        
        // Recreate header on new page
        doc.setFillColor(249, 250, 251);
        doc.rect(20, yPosition, 170, 8, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(55, 65, 81);
        doc.text('Data', 25, yPosition + 5);
        doc.text('Descrição', 50, yPosition + 5);
        doc.text('Categoria', 100, yPosition + 5);
        doc.text('Valor', 140, yPosition + 5);
        doc.text('Status', 170, yPosition + 5);
        yPosition += 12;
        doc.setTextColor(0, 0, 0);
      }

      // Alternating row colors like in preview
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(20, yPosition - 2, 170, 8, 'F');
      }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      // Data
      doc.text(formatDate(transaction.dueDate), 25, yPosition + 3);
      
      // Description (truncated like in preview)
      const description = transaction.description.length > 25 
        ? transaction.description.substring(0, 25) + '...' 
        : transaction.description;
      doc.text(description, 50, yPosition + 3);
      
      // Category
      doc.text(transaction.category, 100, yPosition + 3);
      
      // Amount with color like in preview
      const amountColor = transaction.type === 'income' ? [22, 163, 74] : [220, 38, 38]; // Green or red
      doc.setTextColor(amountColor[0], amountColor[1], amountColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(
        `${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}`,
        140,
        yPosition + 3
      );
      
      // Status with appropriate styling
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      const statusText = transaction.status === 'paid' ? 'Pago' : 
                        transaction.status === 'pending' ? 'Pendente' : 'Vencido';
      doc.text(statusText, 170, yPosition + 3);

      yPosition += 8;
    });

    // Save the PDF
    const fileName = `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
  };

  const filteredTransactions = getFilteredTransactions();
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <FileText className="h-5 w-5" />
            <span>Configuração do Relatório</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Configure os parâmetros para gerar seu relatório personalizado
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <Select value={reportType} onValueChange={(value: 'monthly' | 'custom') => setReportType(value)}>
                <SelectTrigger className="border border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Relatório Mensal</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === 'monthly' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Mês
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start border border-gray-300">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedMonth}
                      onSelect={(date) => date && setSelectedMonth(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Inicial
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start border border-gray-300">
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yyyy') : 'Selecionar data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Final
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start border border-gray-300">
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yyyy') : 'Selecionar data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <TrendingUp className="h-5 w-5" />
            <span>Preview do Relatório</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Visualize um resumo dos dados antes de gerar o PDF
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total de Receitas</p>
                    <p className="text-2xl font-bold text-green-600">R$ {totalIncome.toLocaleString('pt-BR')}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total de Despesas</p>
                    <p className="text-2xl font-bold text-red-600">R$ {totalExpenses.toLocaleString('pt-BR')}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">
                      {balance >= 0 ? 'Saldo Positivo' : 'Déficit'}
                    </p>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      R$ {Math.abs(balance).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <DollarSign className={`h-8 w-8 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Resumo por Tipo</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                <span className="text-gray-700 font-medium">Receitas</span>
                <span className="text-green-600 font-bold">
                  {filteredTransactions.filter(t => t.type === 'income').length} transações
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                <span className="text-gray-700 font-medium">Despesas</span>
                <span className="text-red-600 font-bold">
                  {filteredTransactions.filter(t => t.type === 'expense').length} transações
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowPreview(true)} 
              variant="outline" 
              className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Visualizar Prévia
            </Button>
            <Button 
              onClick={generateCleanPDF}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <ReportPreview
          transactions={filteredTransactions}
          startDate={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
          endDate={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
          selectedCategory=""
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onDownload={generateCleanPDF}
        />
      )}
    </div>
  );
};

export default ModernReportGenerator;
