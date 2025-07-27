import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, Wallet, QrCode, Download, Calendar, CheckCircle, Clock, XCircle, Filter } from "lucide-react";

interface Payment {
  id: string;
  orderId: string;
  vendor: string;
  amount: number;
  method: 'card' | 'upi' | 'wallet' | 'cash';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  transactionId?: string;
}

interface Wallet {
  balance: number;
  pending: number;
  lastUpdated: string;
}

const PaymentSystem = () => {
  const [wallet, setWallet] = useState<Wallet>({
    balance: 15420,
    pending: 2340,
    lastUpdated: new Date().toISOString()
  });
  
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  
  const { toast } = useToast();

  const payments: Payment[] = [
    {
      id: "1",
      orderId: "ORD-001",
      vendor: "Krishna Flour & Grains",
      amount: 850,
      method: "upi",
      status: "completed",
      date: "2024-01-15T14:30:00Z",
      transactionId: "UPI8945612378"
    },
    {
      id: "2", 
      orderId: "ORD-002",
      vendor: "Gupta Snacks & Ingredients",
      amount: 1250,
      method: "wallet",
      status: "completed",
      date: "2024-01-15T12:15:00Z",
      transactionId: "WAL7821456039"
    },
    {
      id: "3",
      orderId: "ORD-003",
      vendor: "Mumbai Fresh Market",
      amount: 680,
      method: "card",
      status: "pending",
      date: "2024-01-15T10:45:00Z",
      transactionId: "CRD5643728190"
    },
    {
      id: "4",
      orderId: "ORD-004",
      vendor: "Krishna Flour & Grains", 
      amount: 2150,
      method: "upi",
      status: "failed",
      date: "2024-01-14T16:20:00Z"
    },
    {
      id: "5",
      orderId: "ORD-005",
      vendor: "Spice King Wholesale",
      amount: 950,
      method: "cash",
      status: "completed",
      date: "2024-01-14T11:30:00Z"
    }
  ];

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'upi': return <Smartphone className="w-4 h-4" />;
      case 'wallet': return <Wallet className="w-4 h-4" />;
      case 'cash': return <QrCode className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const addMoneyToWallet = () => {
    const amount = parseFloat(addAmount);
    if (amount <= 0 || isNaN(amount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to add.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedMethod) {
      toast({
        title: "Select payment method",
        description: "Please select a payment method to proceed.",
        variant: "destructive"
      });
      return;
    }

    // Simulate adding money
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      lastUpdated: new Date().toISOString()
    }));

    toast({
      title: "Money added successfully!",
      description: `₹${amount.toLocaleString()} has been added to your wallet.`
    });

    setAddAmount("");
    setSelectedMethod("");
    setShowAddMoney(false);
  };

  const retryPayment = (paymentId: string) => {
    toast({
      title: "Retrying payment...",
      description: "Your payment is being processed again."
    });
    // In real app, this would trigger payment retry logic
  };

  const downloadInvoice = (paymentId: string) => {
    toast({
      title: "Downloading invoice...",
      description: "Your invoice will be downloaded shortly."
    });
    // In real app, this would download the invoice
  };

  const filteredPayments = payments.filter(payment => {
    const statusMatch = filterStatus === "all" || payment.status === filterStatus;
    const methodMatch = filterMethod === "all" || payment.method === filterMethod;
    return statusMatch && methodMatch;
  });

  const totalCompleted = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payment Management</h2>
          <p className="text-muted-foreground">
            Manage your payments, wallet and transaction history
          </p>
        </div>
      </div>

      <Tabs defaultValue="wallet" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="space-y-6">
          {/* Wallet Balance */}
          <Card className="bg-gradient-primary text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Wallet Balance</span>
                <Wallet className="w-6 h-6" />
              </CardTitle>
              <CardDescription className="text-white/80">
                Available balance for instant payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">₹{wallet.balance.toLocaleString()}</p>
                  <p className="text-sm text-white/70">Available Balance</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg font-semibold">₹{wallet.pending.toLocaleString()}</p>
                    <p className="text-xs text-white/70">Pending Amount</p>
                  </div>
                  <Dialog open={showAddMoney} onOpenChange={setShowAddMoney}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                        Add Money
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Money to Wallet</DialogTitle>
                        <DialogDescription>
                          Add money to your wallet for instant payments
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Amount (₹)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="method">Payment Method</Label>
                          <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="upi">UPI (PhonePe, GPay, Paytm)</SelectItem>
                              <SelectItem value="card">Debit/Credit Card</SelectItem>
                              <SelectItem value="netbanking">Net Banking</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex space-x-2">
                          {[500, 1000, 2000, 5000].map(amount => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              onClick={() => setAddAmount(amount.toString())}
                            >
                              ₹{amount}
                            </Button>
                          ))}
                        </div>
                        <Button onClick={addMoneyToWallet} className="w-full">
                          Add Money
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalCompleted.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalPending.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Awaiting clearance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payments.length}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent transactions and payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full">
                        {getPaymentMethodIcon(payment.method)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{payment.vendor}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Order #{payment.orderId}</span>
                          <span>•</span>
                          <span>{new Date(payment.date).toLocaleDateString('en-IN')}</span>
                          {payment.transactionId && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-xs">{payment.transactionId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(payment.status)}
                          <Badge variant="outline" className="text-xs">
                            {payment.method.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        {payment.status === 'failed' && (
                          <Button size="sm" variant="outline" onClick={() => retryPayment(payment.id)}>
                            Retry
                          </Button>
                        )}
                        {payment.status === 'completed' && (
                          <Button size="sm" variant="outline" onClick={() => downloadInvoice(payment.id)}>
                            <Download className="w-3 h-3 mr-1" />
                            Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>UPI Payment</CardTitle>
                <CardDescription>Quick and secure UPI payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-semibold">UPI ID</p>
                        <p className="text-sm text-muted-foreground">vendor@paytm</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Instant payments with PhonePe, Google Pay, Paytm, and other UPI apps
                  </div>
                  <Button variant="outline" className="w-full">
                    Update UPI ID
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card Payments</CardTitle>
                <CardDescription>Debit and credit card payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="font-semibold">**** **** **** 1234</p>
                        <p className="text-sm text-muted-foreground">HDFC Bank Debit</p>
                      </div>
                    </div>
                    <Badge variant="outline">Primary</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Secure payments with your saved cards
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Cards
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash on Delivery</CardTitle>
                <CardDescription>Pay when you receive your order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <QrCode className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold">Cash Payment</p>
                        <p className="text-sm text-muted-foreground">Available for all orders</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Available</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pay in cash when your order is delivered
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet Payment</CardTitle>
                <CardDescription>Instant payments from your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wallet className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="font-semibold">Wallet Balance</p>
                        <p className="text-sm text-muted-foreground">₹{wallet.balance.toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">Active</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Fastest way to pay for your orders
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setShowAddMoney(true)}>
                    Add Money
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentSystem;