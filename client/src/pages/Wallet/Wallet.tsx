import { useState } from "react";
import { CreditCard, ArrowUpRight, ArrowDownLeft, History, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";

export default function Wallet() {
  const { balance, setBalance, showToast } = useApp();
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("upi");

  const transactions = [
    { id: 1, type: "deposit", amount: 5000, status: "completed", date: "2024-01-15T08:00:00Z", method: "UPI", txnId: "TXN123456789" },
    { id: 2, type: "withdrawal", amount: -2000, status: "pending", date: "2024-01-14T20:00:00Z", method: "Bank Transfer", txnId: "TXN123456788" },
    { id: 3, type: "deposit", amount: 1500, status: "completed", date: "2024-01-14T14:30:00Z", method: "Credit Card", txnId: "TXN123456787" },
    { id: 4, type: "withdrawal", amount: -1000, status: "completed", date: "2024-01-13T16:45:00Z", method: "UPI", txnId: "TXN123456786" },
    { id: 5, type: "deposit", amount: 3000, status: "completed", date: "2024-01-13T10:20:00Z", method: "Net Banking", txnId: "TXN123456785" },
  ];

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: "📱", processing: "Instant" },
    { id: "card", name: "Credit/Debit Card", icon: "💳", processing: "2-3 minutes" },
    { id: "netbanking", name: "Net Banking", icon: "🏦", processing: "5-10 minutes" },
    { id: "wallet", name: "Digital Wallet", icon: "📲", processing: "Instant" },
  ];

  const handleDeposit = () => {
    if (depositAmount < 100) {
      showToast("Minimum deposit amount is ₹100", "error");
      return;
    }

    if (depositAmount > 50000) {
      showToast("Maximum deposit amount is ₹50,000", "error");
      return;
    }

    // Mock deposit process
    setBalance(balance + depositAmount);
    showToast(`Successfully deposited ₹${depositAmount}`, "success");
    setDepositAmount(1000);
  };

  const handleWithdraw = () => {
    if (withdrawAmount < 500) {
      showToast("Minimum withdrawal amount is ₹500", "error");
      return;
    }

    if (withdrawAmount > balance) {
      showToast("Insufficient balance", "error");
      return;
    }

    if (withdrawAmount > 25000) {
      showToast("Maximum withdrawal amount is ₹25,000 per day", "error");
      return;
    }

    // Mock withdrawal process
    setBalance(balance - withdrawAmount);
    showToast(`Withdrawal request of ₹${withdrawAmount} submitted`, "success");
    setWithdrawAmount(500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-accent-green text-primary-dark";
      case "pending": return "bg-yellow-500 text-primary-dark";
      case "failed": return "bg-danger-red text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-gray-400">Manage your deposits and withdrawals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-1">
          <Card className="glass-morphism mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-primary-dark" />
                </div>
                <p className="text-gray-400 text-sm mb-2">Available Balance</p>
                <p className="text-4xl font-bold text-accent-green mb-4">₹{balance.toLocaleString()}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">Today's Deposits</p>
                    <p className="text-accent-green font-semibold">₹5,000</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">Today's Withdrawals</p>
                    <p className="text-danger-red font-semibold">₹2,000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">This Month</span>
                <span className="text-accent-green font-semibold">+₹12,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Total Deposited</span>
                <span className="text-white font-semibold">₹45,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Total Withdrawn</span>
                <span className="text-white font-semibold">₹32,550</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Pending</span>
                <span className="text-yellow-500 font-semibold">₹2,000</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary-dark mb-6">
              <TabsTrigger value="deposit" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Deposit
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-accent-green data-[state=active]:text-primary-dark">
                <History className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="text-white">Add Money to Wallet</CardTitle>
                  <p className="text-gray-400 text-sm">Minimum: ₹100 | Maximum: ₹50,000</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Enter Amount</label>
                    <Input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="bg-secondary-dark border-gray-600 text-white text-xl font-semibold"
                      min="100"
                      max="50000"
                    />
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {[500, 1000, 2500, 5000].map((amount) => (
                        <Button
                          key={amount}
                          size="sm"
                          variant="outline"
                          onClick={() => setDepositAmount(amount)}
                          className="border-gray-600 text-white hover:bg-secondary-dark"
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="text-sm text-gray-400 mb-3 block">Select Payment Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                          className={`justify-start p-4 h-auto ${
                            selectedPaymentMethod === method.id 
                              ? "bg-accent-green text-primary-dark" 
                              : "border-gray-600 text-white hover:bg-secondary-dark"
                          }`}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div className="text-left">
                              <div className="font-medium">{method.name}</div>
                              <div className="text-xs opacity-75">{method.processing}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="bg-secondary-dark rounded-lg p-4 flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-accent-green mt-0.5" />
                    <div className="text-sm">
                      <p className="text-white font-medium mb-1">Secure Payment</p>
                      <p className="text-gray-400">All transactions are encrypted and processed through secure payment gateways.</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleDeposit}
                    className="w-full gradient-accent text-primary-dark font-semibold py-3 hover:opacity-90"
                  >
                    Add ₹{depositAmount} to Wallet
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="text-white">Withdraw Money</CardTitle>
                  <p className="text-gray-400 text-sm">Minimum: ₹500 | Maximum: ₹25,000 per day</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Enter Amount</label>
                    <Input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      className="bg-secondary-dark border-gray-600 text-white text-xl font-semibold"
                      min="500"
                      max={Math.min(balance, 25000)}
                    />
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {[500, 1000, 2500, 5000].map((amount) => (
                        <Button
                          key={amount}
                          size="sm"
                          variant="outline"
                          onClick={() => setWithdrawAmount(amount)}
                          className="border-gray-600 text-white hover:bg-secondary-dark"
                          disabled={amount > balance}
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="bg-secondary-dark rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Bank Account Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account Holder:</span>
                        <span className="text-white">BetMaster</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account Number:</span>
                        <span className="text-white">****1234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bank:</span>
                        <span className="text-white">State Bank of India</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Time:</span>
                        <span className="text-accent-green">2-4 hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Info */}
                  <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4">
                    <p className="text-yellow-500 text-sm">
                      <strong>Note:</strong> Withdrawals are processed within 2-4 hours during business hours. 
                      A processing fee of ₹10 will be deducted for withdrawals below ₹2,000.
                    </p>
                  </div>

                  <Button
                    onClick={handleWithdraw}
                    className="w-full bg-danger-red hover:bg-red-600 text-white font-semibold py-3"
                  >
                    Withdraw ₹{withdrawAmount}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="text-white">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-secondary-dark rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "deposit" ? "bg-accent-green" : "bg-danger-red"
                          }`}>
                            {transaction.type === "deposit" ? (
                              <ArrowDownLeft className="w-5 h-5 text-white" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium capitalize">{transaction.type}</p>
                            <p className="text-gray-400 text-sm">{transaction.method}</p>
                            <p className="text-gray-500 text-xs">
                              ID: {transaction.txnId} • {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                          <p className={`font-semibold mt-1 ${
                            transaction.amount > 0 ? "text-accent-green" : "text-danger-red"
                          }`}>
                            {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
