import faker from "faker";
import { Prisma } from "@prisma/client";
import prisma from "../../server/db/prisma";

// const userIdOne = "testuser1";
// const userIdTwo = "testuser2";
// const userIdThree = "testuser3";

// const projectIdOne = "project1";
// const projectIdTwo = "project2";

// export const testData = {
//   users: [
//     {
//       id: userIdOne,
//       name: "Cameron Jenkinson",
//       email: "cameron+test@trackstack.in",
//       username: "cameronjenkinson",
//       type: "BUSINESS",
//       profile: {
//         create: {
//           bio: "--",
//         },
//       },
//     },
//     {
//       id: userIdTwo,
//       name: "Jamie Jones",
//       email: "cameron+jamie@trackstack.in",
//       username: "jamiejones",
//       type: "BUSINESS",
//       profile: {
//         create: {
//           bio: "--",
//         },
//       },
//     },
//     {
//       id: userIdThree,
//       name: "Hart & Neenan",
//       email: "cameron+handn@trackstack.in",
//       username: "hartandneenan",
//       type: "ARTIST",
//       isGuest: true,
//       profile: {
//         create: {
//           bio: "--",
//         },
//       },
//     },
//   ],
//   projects: [
//     {
//       id: projectIdOne,
//       name: "Demos",
//       slug: `inbox-${projectIdOne}`,
//       users: [userIdOne],
//     },
//     {
//       id: projectIdTwo,
//       name: "Demos",
//       slug: `inbox-${projectIdTwo}`,
//       users: [userIdTwo],
//     },
//   ],
//   stacks: [
//     {
//       id: "stack1",
//       name: "100% Signing",
//       commentBody:
//         "We are interested in signing this record. Please hold it, we will be in touch.",
//       projectId: projectIdOne,
//     },
//     {
//       id: "stack2",
//       name: "First round filter",
//       commentBody:
//         "Your track has made it to the first round filter, that means we will be testing it out in upcoming sets.",
//       projectId: projectIdOne,
//     },
//     {
//       id: "stack3",
//       name: "Shortlisted to test",
//       commentBody:
//         "Your track has made it to my test shortlist and I will be testing it in sets soon.",
//       projectId: projectIdTwo,
//     },
//   ],
// };

const createUserFactory = () => {
  const create = async ({
    name = faker.name.findName(),
    email = faker.internet.email(),
    username = faker.internet.userName(),
    isGuest = true,
  }) => {
    const input = {
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      isGuest,
    };

    return prisma.user.create({
      data: input,
    });
  };

  const remove = async (id: string) => {
    return prisma.$executeRaw(`DELETE FROM "User" WHERE id = '${id}';`);
  };

  return {
    create,
    remove,
  };
};

export const createDataFactory = () => {
  const emptyDatabase = async () => {
    const tables = Prisma.dmmf.datamodel.models.map((model) => model.name);

    await Promise.all(
      tables.map((table) => prisma.$executeRaw(`DELETE FROM "${table}";`))
    );
  };

  const user = createUserFactory();

  return {
    emptyDatabase,
    user,
  };
};
