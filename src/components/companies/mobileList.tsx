"use client"

import { useAuth } from "@/hooks/useAuth"
import { Company } from "@/types/company"
import { Building2, ChevronDown, PenLine, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { CompanyActionButton } from "./actions"
import { solutions } from "@/constants/solutions"
import Image from "next/image"

export default function UsersMobileList() {
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const { isAdmin } = useAuth()

  const refetchCompanies = useCallback(async () => {
    if (!isAdmin) return

    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "listCompanies", payload: {} }),
    })

    if (!res.ok) throw new Error("Erro ao carregar empresas")
    const { companies } = await res.json()
    setCompanies(companies)
  }, [isAdmin])

  useEffect(() => {
    refetchCompanies()
  }, [refetchCompanies])

  if (!isAdmin) return

  const toggleExpand = (id: string) => setExpandedCompanyId(prev => (prev === id ? null : id))

  return (
    <div className="md:hidden space-y-2">
      {companies.map(company => {
        const isExpanded = expandedCompanyId === company.id

        return (
          <div key={company.id} className="p-3 rounded-xl text-sm border border-surface">
            <div className="flex items-center justify-between" onClick={() => toggleExpand(company.id)}>
              <div className="flex items-center gap-2">
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={`${company.business_name} logo`}
                    width={28}
                    height={28}
                    sizes="50px"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-accent bg-accent/10">
                    <Building2 className="w-4 h-4" />
                  </div>
                )}
                <span className="font-semibold">{company.business_name}</span>
              </div>
              <ChevronDown className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                <p><b>Email:</b> {company.email || "—"}</p>
                <div className="grid grid-cols-2 gap-2">
                  {solutions.map(item => (
                    <div key={item.key} className="flex items-center gap-1">
                      <div className="relative flex items-center">
                        <div className={`w-10 h-6 rounded-full opacity-50 ${company[item.key] ? "bg-emerald-400" : "bg-surface"}`} />
                        <div className={`absolute w-4 h-4 rounded-full shadow ${company[item.key] ? "left-5" : "left-1"} bg-light`}
                        />
                      </div>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-1.5 rounded-lg border-2 border-surface">
                    <CompanyActionButton
                      icon={<PenLine className="w-4 h-4" />}
                      showLabel={true}
                      label="Atualizar"
                      action="updateCompany"
                      company={company}
                      onSuccess={refetchCompanies}
                    />
                  </div>
                  <div className="flex-1 px-3 py-1.5 rounded-lg border-2 border-accent bg-accent text-light">
                    <CompanyActionButton
                      icon={<Trash2 className="w-4 h-4" />}
                      showLabel={true}
                      label="Excluir"
                      action="deleteCompany"
                      company={company}
                      onSuccess={refetchCompanies}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {companies.length === 0 && (
        <div className="flex items-center justify-center min-h-40">
          <p className="text-sm text-dark/50">Nenhuma empresa encontrada.</p>
        </div>
      )}
    </div>
  )
}