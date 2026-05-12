"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, ShieldCheck, Star, Users, Wrench } from "lucide-react";

import { clearStoredAuth, getStoredAuth } from "@/lib/auth";
import { AdminSummary, API_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ApiState = "idle" | "loading" | "success" | "error";

const emptySummary: AdminSummary = {
  metrics: {
    total_technicians: 0,
    verified_technicians: 0,
    pending_verification: 0,
    active_services: 0,
    inactive_services: 0,
    open_disputes: 0,
    in_review_disputes: 0,
    resolved_disputes: 0,
    average_rating: 0,
    total_categories: 0,
    total_zones: 0,
  },
  recent_technicians: [],
  recent_services: [],
  recent_disputes: [],
  role_breakdown: {},
  alerts: [],
};

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState<AdminSummary>(emptySummary);
  const [status, setStatus] = useState<ApiState>("idle");
  const [message, setMessage] = useState("Login in /login or use an administrator JWT token to load platform metrics.");

  useEffect(() => {
    const session = getStoredAuth();
    if (session) {
      setToken(session.accessToken);
      setMessage(`Sesion activa como ${session.user.username} (${session.user.role}). Puedes sincronizar el panel.`);
    }
  }, []);

  function logout() {
    clearStoredAuth();
    setToken("");
    setMessage("Sesion cerrada. Inicia sesion en /login o pega un token admin manual.");
  }

  const metricCards = useMemo(
    () => [
      {
        title: "Tecnicos",
        value: summary.metrics.total_technicians,
        detail: `${summary.metrics.verified_technicians} verificados`,
        icon: Users,
      },
      {
        title: "Servicios activos",
        value: summary.metrics.active_services,
        detail: `${summary.metrics.inactive_services} inactivos`,
        icon: Wrench,
      },
      {
        title: "Disputas abiertas",
        value: summary.metrics.open_disputes,
        detail: `${summary.metrics.in_review_disputes} en revision`,
        icon: AlertTriangle,
      },
      {
        title: "Rating promedio",
        value: summary.metrics.average_rating,
        detail: `${summary.metrics.total_categories} categorias`,
        icon: Star,
      },
    ],
    [summary],
  );

  async function loadSummary() {
    if (!token) {
      setMessage("Add an administrator JWT token before loading metrics.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(`${API_URL}/admin/summary/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Admin summary request failed");
      }
      setSummary((await response.json()) as AdminSummary);
      setStatus("success");
      setMessage("Admin summary loaded.");
    } catch {
      setStatus("error");
      setMessage("Could not load admin summary. Check that the token belongs to an admin user.");
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-4 rounded-3xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <Badge variant="secondary">Administrator dashboard</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Control operativo</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Monitorea tecnicos, servicios, disputas y alertas para mantener la plataforma lista para el flujo de WhatsApp.
          </p>
        </div>
        <Button onClick={loadSummary} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}
          Sync admin data
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Conexion segura</CardTitle>
          <CardDescription>Usa un access token de un usuario con rol admin o permisos staff.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <Input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Admin JWT access token" type="password" />
          <Button variant="outline" onClick={loadSummary} disabled={isLoading}>
            Load summary
          </Button>
          <Button variant="ghost" onClick={logout} disabled={isLoading}>
            Cerrar sesion
          </Button>
          <p className={`text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}>{message}</p>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>Prioridades para revision humana.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.alerts.length === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl border p-4 text-sm text-muted-foreground">
                <CheckCircle2 className="size-5 text-emerald-600" />
                No hay alertas operativas por ahora.
              </div>
            ) : (
              summary.alerts.map((alert) => (
                <div key={`${alert.type}-${alert.title}`} className="rounded-2xl border p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-amber-600" />
                    <p className="font-medium">{alert.title}</p>
                    <Badge variant={alert.type === "critical" ? "destructive" : "secondary"}>{alert.type}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{alert.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribucion de roles</CardTitle>
            <CardDescription>Usuarios registrados por rol de plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {Object.keys(summary.role_breakdown).length === 0 ? (
              <p className="text-sm text-muted-foreground">Carga el resumen para ver roles.</p>
            ) : (
              Object.entries(summary.role_breakdown).map(([role, total]) => (
                <div key={role} className="flex items-center justify-between rounded-2xl border p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span className="capitalize">{role}</span>
                  </div>
                  <span className="text-xl font-semibold">{total}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Tecnicos recientes</CardTitle>
          <CardDescription>Verificacion, disponibilidad y cobertura.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataSeparator />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Servicios</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Zonas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.recent_technicians.length === 0 ? (
                  <EmptyRow colSpan={5} label="No hay tecnicos para mostrar." />
                ) : (
                  summary.recent_technicians.map((technician) => (
                    <TableRow key={technician.id}>
                      <TableCell>
                        <p className="font-medium">{technician.name}</p>
                        <p className="text-sm text-muted-foreground">{technician.email || "Sin email"}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={technician.is_verified ? "default" : "secondary"}>
                          {technician.is_verified ? "Verificado" : "Pendiente"}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">{technician.availability_status}</p>
                      </TableCell>
                      <TableCell>{technician.service_count}</TableCell>
                      <TableCell>{technician.average_rating}</TableCell>
                      <TableCell>{technician.zones.join(", ") || "Sin zonas"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Servicios recientes</CardTitle>
            <CardDescription>Catalogo que alimenta recomendaciones.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataSeparator />
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Tecnico</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.recent_services.length === 0 ? (
                    <EmptyRow colSpan={4} label="No hay servicios recientes." />
                  ) : (
                    summary.recent_services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <p className="font-medium">{service.title}</p>
                          <p className="text-sm text-muted-foreground">{service.category}</p>
                        </TableCell>
                        <TableCell>{service.technician}</TableCell>
                        <TableCell>${Number(service.base_price).toLocaleString("es-CO")}</TableCell>
                        <TableCell>
                          <Badge variant={service.is_active ? "default" : "secondary"}>
                            {service.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disputas recientes</CardTitle>
            <CardDescription>Casos para moderacion humana.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataSeparator />
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Caso</TableHead>
                    <TableHead>Tecnico</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.recent_disputes.length === 0 ? (
                    <EmptyRow colSpan={4} label="No hay disputas recientes." />
                  ) : (
                    summary.recent_disputes.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell>
                          <p className="font-medium">{dispute.title}</p>
                          <p className="text-sm text-muted-foreground">Cliente: {dispute.client}</p>
                        </TableCell>
                        <TableCell>{dispute.technician}</TableCell>
                        <TableCell>{dispute.priority}</TableCell>
                        <TableCell>
                          <Badge variant={dispute.status === "open" ? "destructive" : "secondary"}>{dispute.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DataSeparator() {
  return <Separator className="mb-4" />;
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center text-muted-foreground">
        {label}
      </TableCell>
    </TableRow>
  );
}
