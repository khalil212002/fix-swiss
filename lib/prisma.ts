import { Match, Player, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
  .$extends({
    result: {
      player: {
        avoid: {
          needs: { avoid_str: true },
          compute(data) {
            return (JSON.parse(data.avoid_str) as Array<number>).filter(
              (v) => v != null
            );
          },
        },
        seating: {
          needs: { seating_str: true },
          compute(data) {
            return JSON.parse(data.seating_str) as Array<1 | -1>;
          },
        },
      },
    },
  })
  .$extends({
    model: {
      match: {
        async addMatches(
          matches: Match[],
          players: (Partial<Player> & {
            avoid: Array<number | null>;
            seating: Array<1 | -1>;
          })[]
        ): Promise<void> {
          const pl = new Map<
            number,
            Partial<Player> & {
              avoid: Array<number | null>;
              seating: Array<1 | -1>;
            }
          >();
          players.forEach((v) => pl.set(v.id!, v));
          return prisma.$transaction(async (tx) => {
            await tx.match.createMany({ data: matches });
            for (let i = 0; i < matches.length; i++) {
              const v = matches[i];

              await tx.player.update({
                data: {
                  avoid_str: JSON.stringify(
                    pl.get(v.player1!)?.avoid.concat(v.player2)
                  ),
                  seating_str: JSON.stringify(
                    pl.get(v.player1!)?.seating.concat(1)
                  ),
                },
                where: { id: v.player1! },
              });
              if (v.player2 == null) {
                await tx.player.update({
                  where: { id: v.player1! },
                  data: { receivedBye: true },
                });
                return;
              }
              await tx.player.update({
                data: {
                  avoid_str: JSON.stringify(
                    pl.get(v.player2!)?.avoid.concat(v.player1)
                  ),
                  seating_str: JSON.stringify(
                    pl.get(v.player2!)?.seating.concat(-1)
                  ),
                },
                where: { id: v.player2! },
              });
            }
          });
        },
      },
    },
  });
const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
