import { PrismaClient, DemandeStatus, AuditAction } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { buildConnectionString } from './connection';

const adapter = new PrismaPg({ connectionString: buildConnectionString() });

const prisma = new PrismaClient({ adapter });

/**
 * Main seed function.
 * Creates 3 users and 5 demandes — one per status.
 * Each demande gets a CREATED audit log entry.
 * Safe to re-run — upsert prevents duplication.
 */
async function main(): Promise<void> {
  console.log('--- Seeding database... ---');

  // ─── Users ────────────────────────────────────────────────────────────────

  const alice = await prisma.user.upsert({
    where: { email: 'alice.martin@demo.com' },
    update: {},
    create: {
      name: 'Alice Martin',
      email: 'alice.martin@demo.com',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob.dupont@demo.com' },
    update: {},
    create: {
      name: 'Bob Dupont',
      email: 'bob.dupont@demo.com',
    },
  });

  const carla = await prisma.user.upsert({
    where: { email: 'carla.mendes@demo.com' },
    update: {},
    create: {
      name: 'Carla Mendes',
      email: 'carla.mendes@demo.com',
    },
  });

  // ─── Demandes ─────────────────────────────────────────────────────────────
  // One demande per status so the dashboard immediately shows all filter states

  const demandesData = [
    {
      reference: 'DEM-4E084144',
      title: 'Demande de matériel informatique',
      description: "Besoin d'un second écran pour améliorer la productivité.",
      status: DemandeStatus.BROUILLON,
      createdById: alice.id,
      assignedToId: bob.id,
    },
    {
      reference: 'DEM-4E084189',
      title: 'Accès au système de facturation',
      description: "Requête d'accès en lecture au module de facturation.",
      status: DemandeStatus.SOUMISE,
      createdById: bob.id,
      assignedToId: carla.id,
    },
    {
      reference: 'DEM-4E084426',
      title: 'Formation Excel avancé',
      description: 'Inscription à la session de formation du 15 mars.',
      status: DemandeStatus.VALIDEE,
      createdById: carla.id,
      assignedToId: alice.id,
    },
    {
      reference: 'DEM-4E084631',
      title: 'Changement de bureau',
      description: 'Demande de déménagement vers le bureau 3B.',
      status: DemandeStatus.REJETEE,
      createdById: alice.id,
      assignedToId: bob.id,
    },
    {
      reference: 'DEM-4E084715',
      title: 'Abonnement outil de design',
      description: "Licence Figma annuelle pour l'équipe produit.",
      status: DemandeStatus.ANNULEE,
      createdById: bob.id,
      assignedToId: null,
    },
  ];

  for (const data of demandesData) {
    const demande = await prisma.demande.upsert({
      where: { reference: data.reference },
      update: {},
      create: data,
    });

    const existingLog = await prisma.auditLog.findFirst({
      where: { demandeId: demande.id, action: AuditAction.CREATED },
    });

    if (!existingLog) {
      await prisma.auditLog.create({
        data: {
          action: AuditAction.CREATED,
          metadata: {},
          demandeId: demande.id,
          userId: data.createdById,
        },
      });
    }
  }

  console.log('--- Seed complete. ---');
}

main()
  .catch((e: unknown) => {
    console.error('--- Seed failed:', e, '---');
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
