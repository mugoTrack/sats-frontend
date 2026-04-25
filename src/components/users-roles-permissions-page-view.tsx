"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  EntityForm,
  type EntityFormField,
} from "@/components/common/entity-form";
import { DataTable } from "@/components/data-table";
import { ResourceFeedback } from "@/components/resource-feedback";
import { organizationCrudService } from "@/lib/organizations/organization-crud";
import {
  type CreateRoleInput,
  roleService,
  type RoleRecord,
} from "@/lib/users/role-service";

interface OrganizationOption {
  id: string;
  name: string;
}

interface CreateRoleFormValues extends Record<string, string> {
  organization_name: string;
  role_name: string;
  description: string;
  is_global: string;
}

const defaultCreateRoleValues: CreateRoleFormValues = {
  organization_name: "",
  role_name: "",
  description: "",
  is_global: "false",
};

export function UsersRolesPermissionsPageView() {
  const [rows, setRows] = useState<RoleRecord[] | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createValues, setCreateValues] = useState<CreateRoleFormValues>(
    defaultCreateRoleValues,
  );
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadRoles = useCallback(async () => {
    const response = await roleService.listRoles(1, 200);
    return response.items;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [roleItems, organizationItems] = await Promise.all([
          loadRoles(),
          organizationCrudService.listOrganizations(),
        ]);

        if (!isMounted) {
          return;
        }

        setRows(roleItems);
        setOrganizations(
          organizationItems.map((item) => ({
            id: item.id,
            name: item.organization_name,
          })),
        );
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load roles",
        );
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [loadRoles]);

  const roleFields = useMemo<EntityFormField<CreateRoleFormValues>[]>(
    () => [
      {
        name: "is_global",
        label: "Role scope",
        type: "select",
        required: true,
        options: [
          { value: "true", label: "Global role" },
          { value: "false", label: "Organization role" },
        ],
      },
      {
        name: "organization_name",
        label: "Organization",
        type: "select",
        required: createValues.is_global !== "true",
        options: organizations.map((item) => ({
          value: item.name,
          label: item.name,
        })),
      },
      { name: "role_name", label: "Role name", required: true, colSpan: 2 },
      {
        name: "description",
        label: "Description",
        required: true,
        colSpan: 2,
      },
    ],
    [createValues.is_global, organizations],
  );

  const organizationNameById = useMemo(() => {
    return organizations.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});
  }, [organizations]);

  const handleCreateRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setIsCreating(true);

    try {
      const isGlobal = createValues.is_global === "true";
      const selectedOrganization = organizations.find(
        (item) => item.name === createValues.organization_name,
      );

      if (!isGlobal && !selectedOrganization?.id) {
        throw new Error("Please select an organization for a non-global role.");
      }

      const payload: CreateRoleInput = {
        organization_id: isGlobal ? null : (selectedOrganization?.id ?? null),
        role_name: createValues.role_name.trim(),
        description: createValues.description.trim(),
        is_global: isGlobal,
      };

      if (!payload.role_name || !payload.description) {
        throw new Error("Role name and description are required.");
      }

      await roleService.createRole(payload);

      const refreshedRows = await loadRoles();
      setRows(refreshedRows);
      setCreateValues(defaultCreateRoleValues);
      setCreateSuccess("Role created successfully.");
      setShowCreateForm(false);
    } catch (requestError) {
      setCreateError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to create role",
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (error) {
    return <ResourceFeedback title="Roles unavailable" detail={error} />;
  }

  if (!rows) {
    return (
      <ResourceFeedback
        title="Loading roles"
        detail="Fetching role catalog from SATS services."
      />
    );
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-6 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 xl:px-7">
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-[var(--color-ice)]">
            Roles
          </h2>
          <button
            type="button"
            onClick={() => {
              setShowCreateForm((current) => !current);
              setCreateError("");
              setCreateSuccess("");
            }}
            className="rounded-full border border-[var(--color-sand)]/40 bg-[var(--color-sand)]/18 px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ice)] transition-colors hover:bg-[var(--color-sand)]/28"
          >
            {showCreateForm ? "Close form" : "Add role"}
          </button>
        </div>

        {showCreateForm ? (
          <EntityForm
            title="Create role"
            fields={roleFields}
            values={createValues}
            errorMessage={createError}
            submitLabel="Create role"
            submitLoadingLabel="Creating..."
            isSubmitting={isCreating}
            onSubmit={handleCreateRole}
            onCancel={() => {
              setShowCreateForm(false);
              setCreateError("");
            }}
            onChange={(name, value) =>
              setCreateValues((current) => ({ ...current, [name]: value }))
            }
          />
        ) : null}

        {createSuccess ? (
          <p className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
            {createSuccess}
          </p>
        ) : null}

        <DataTable
          rows={rows}
          horizontalScroll
          columns={[
            {
              header: "Role",
              render: (row) => row.roleName,
            },
            {
              header: "Description",
              render: (row) => row.description || "-",
            },
            {
              header: "Scope",
              render: (row) => (row.isGlobal ? "Global" : "Organization"),
            },
            {
              header: "Organization",
              render: (row) => {
                if (row.isGlobal || !row.organizationId) {
                  return "-";
                }

                return (
                  organizationNameById[row.organizationId] ?? row.organizationId
                );
              },
            },
          ]}
        />
      </section>
    </main>
  );
}
