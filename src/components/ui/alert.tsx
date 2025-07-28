import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Base Alert Component
type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-background text-foreground border-border',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      success: 'border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600 bg-green-50 dark:bg-green-950/50',
      warning: 'border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50',
      info: 'border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600 bg-blue-50 dark:bg-blue-950/50'
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Alert.displayName = 'Alert';

// Alert Title Component
const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = '', ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

// Alert Description Component
const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

// Dismissible Alert Wrapper
type DismissibleAlertProps = {
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
} & React.HTMLAttributes<HTMLDivElement>;

const DismissibleAlert: React.FC<DismissibleAlertProps> = ({ children, onDismiss, className = '', ...props }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) return null;

  return (
    <Alert className={`pr-12 ${className}`} {...props}>
      {children}
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </Alert>
  );
};

// Demo Component
const AlertDemo = () => {
  const [dismissibleAlerts, setDismissibleAlerts] = useState({
    success: true,
    destructive: true,
    warning: true,
    info: true
  });

  const handleDismiss = (type: keyof typeof dismissibleAlerts) => {
    setDismissibleAlerts(prev => ({ ...prev, [type]: false }));
  };

  const resetAlerts = () => {
    setDismissibleAlerts({
      success: true,
      destructive: true,
      warning: true,
      info: true
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shadcn/UI Alert Components</h1>
        <p className="text-gray-600">Komponen alert yang mengikuti pola shadcn/ui dengan Alert dan AlertDescription</p>
      </div>

      {/* Basic Alerts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Basic Alerts</h2>
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              Ini adalah alert default dengan icon dan deskripsi.
            </AlertDescription>
          </Alert>

          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Operasi berhasil diselesaikan. Data telah disimpan ke database.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Terjadi kesalahan saat memproses permintaan. Silakan coba lagi atau hubungi administrator.
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Perhatian! Akun Anda akan kedaluwarsa dalam 3 hari. Perpanjang langganan untuk melanjutkan akses.
            </AlertDescription>
          </Alert>

          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Pemeliharaan sistem dijadwalkan pada hari Minggu, 28 Juli 2025 pukul 02:00 - 04:00 WIB.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Simple Alerts without titles */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Simple Alerts</h2>
        <div className="space-y-4">
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              File berhasil diunggah dan diproses.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Format file tidak didukung. Gunakan format JPG, PNG, atau PDF.
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              Alert tanpa icon - hanya berisi informasi teks sederhana.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Dismissible Alerts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dismissible Alerts</h2>
        <div className="space-y-4">
          {dismissibleAlerts.success && (
            <DismissibleAlert 
              variant="success" 
              onDismiss={() => handleDismiss('success')}
            >
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Task Completed</AlertTitle>
              <AlertDescription>
                Semua tugas telah berhasil diselesaikan. Klik X untuk menutup pesan ini.
              </AlertDescription>
            </DismissibleAlert>
          )}

          {dismissibleAlerts.destructive && (
            <DismissibleAlert 
              variant="destructive" 
              onDismiss={() => handleDismiss('destructive')}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                Koneksi terputus. Periksa koneksi internet Anda dan coba lagi.
              </AlertDescription>
            </DismissibleAlert>
          )}

          {dismissibleAlerts.warning && (
            <DismissibleAlert 
              variant="warning" 
              onDismiss={() => handleDismiss('warning')}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Storage Almost Full</AlertTitle>
              <AlertDescription>
                Penyimpanan hampir penuh (85% terpakai). Hapus file yang tidak perlu untuk mengosongkan ruang.
              </AlertDescription>
            </DismissibleAlert>
          )}

          {dismissibleAlerts.info && (
            <DismissibleAlert 
              variant="info" 
              onDismiss={() => handleDismiss('info')}
            >
              <Info className="h-4 w-4" />
              <AlertTitle>New Feature Available</AlertTitle>
              <AlertDescription>
                Fitur baru telah tersedia! Kunjungi menu Settings untuk mengaktifkannya.
              </AlertDescription>
            </DismissibleAlert>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={resetAlerts}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reset Dismissible Alerts
          </button>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Cara Penggunaan</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Import:</h3>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
{`import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Basic Usage:</h3>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
{`<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your message here
  </AlertDescription>
</Alert>`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">Available Variants:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><code>default</code> - Alert standar</li>
              <li><code>destructive</code> - Alert error/destructive</li>
              <li><code>success</code> - Alert sukses</li>
              <li><code>warning</code> - Alert peringatan</li>
              <li><code>info</code> - Alert informasi</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

// Export individual components
export { Alert, AlertTitle, AlertDescription, DismissibleAlert };

export default AlertDemo;