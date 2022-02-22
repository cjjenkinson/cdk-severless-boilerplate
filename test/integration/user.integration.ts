import { createDataFactory } from "../data-factory/index";
import { request, graphql } from "../request";

const datafactory = createDataFactory();

describe(`currentUser`, () => {
  let user;

  beforeAll(async () => {
    user = await datafactory.user.create({
      name: "Cameron Jenkinson",
    });
  });

  it(`should return null when unauthenticated`, async () => {
    const response = await request(
      graphql`
        {
          currentUser {
            id
          }
        }
      `
    );

    expect(response?.data?.currentUser).toBeNull();
  });

  it(`should return the current user data when authenticated`, async () => {
    const response = await request(
      graphql`
        {
          currentUser {
            id
            name
            isGuest
          }
        }
      `,
      {
        context: {
          user,
        },
      }
    );

    expect(response).toEqual({
      data: {
        currentUser: {
          id: expect.any(String),
          name: user.name,
          isGuest: true,
        },
      },
    });
  });
});

// describe(`userById`, () => {
//   const datafactory = createDataFactory();

//   let user;

//   beforeAll(async () => {
//     user = await datafactory.user.create({});
//   });

//   afterAll(async () => {
//     await datafactory.emptyDatabase();
//   });

// });

// describe(`userBySlug`, () => {
//   const datafactory = createDataFactory();

//   let user;

//   beforeAll(async () => {
//     user = await datafactory.user.create({});
//   });

//   afterAll(async () => {
//     await datafactory.emptyDatabase();
//   });

// });

// describe(`upsertUser`, () => {
//   const datafactory = createDataFactory();

//   let user;

//   beforeAll(async () => {
//     user = await datafactory.user.create({});
//   });

//   afterAll(async () => {
//     await datafactory.emptyDatabase();
//   });

// });

describe(`createGuestUser`, () => {
  let user;

  beforeAll(async () => {
    user = await datafactory.user.create({
      name: "Cameron Jenkinson",
    });
  });

  it(`should update the user's name`, async () => {
    const response = await request(
      graphql`
        mutation updateUser($id: String!, $input: UpdateUserInput!) {
          updateUser(id: $id, input: $input) {
            id
            name
          }
        }
      `,
      {
        context: {
          user,
        },
        variables: {
          id: user.id,
          input: {
            name: "Updated Name",
          },
        },
      }
    );

    expect(response).toEqual({
      data: {
        updateUser: {
          id: user.id,
          name: "Updated Name",
        },
      },
    });
  });
});

describe(`createBusinessUser`, () => {
  let businessUser;

  beforeAll(async () => {
    businessUser = await datafactory.user.create({
      name: "Cameron Jenkinson",
    });
  });

  it(`should create a new workspace and inbox with the business free plan`, async () => {
    await request(
      graphql`
        mutation createBusinessUser(
          $email: String!
          $name: String!
          $attributionInboxId: String
        ) {
          createBusinessUser(
            email: $email
            name: $name
            attributionInboxId: $attributionInboxId
          ) {
            id
          }
        }
      `,
      {
        context: {
          user: businessUser,
        },
        variables: {
          email: businessUser.email,
          name: businessUser.name,
        },
      }
    );

    const response = await request(
      graphql`
        query userById($userId: String!) {
          userById(id: $userId) {
            id
            name
            email
            isGuest
            activatedAt
            workspace {
              id
              plan
              name
              slug
              owner {
                id
                name
              }
              inbox {
                id
                stacks {
                  name
                  commentBody
                }
                feedbackTemplates {
                  label
                  commentBody
                }
              }
            }
          }
        }
      `,
      {
        context: {
          user: businessUser,
        },
        variables: {
          userId: businessUser.id,
        },
      }
    );

    expect(response).toEqual({
      data: {
        userById: {
          id: businessUser.id,
          name: businessUser.name,
          email: businessUser.email,
          isGuest: true,
          activatedAt: null,
          workspace: {
            id: expect.any(String),
            name: expect.any(String),
            slug: expect.any(String),
            plan: "BUSINESS_FREE",
            owner: {
              id: businessUser.id,
              name: expect.any(String),
            },
            inbox: {
              id: expect.any(String),
              stacks: expect.arrayContaining([
                {
                  commentBody:
                    "Your track aligned well and has been shortlisted. More information to follow.",
                  name: "First Round",
                },
              ]),
              feedbackTemplates: expect.arrayContaining([
                {
                  commentBody:
                    "This track did not make it this time but please send more when they are ready. Thank you.",
                  label: "Pass",
                },
              ]),
            },
          },
        },
      },
    });
  });
});

describe(`activateSenderAccount`, () => {
  let senderUser;

  beforeAll(async () => {
    senderUser = await datafactory.user.create({
      name: "Cameron Jenkinson",
    });
  });

  it(`should create a new workspace with the sender free plan`, async () => {
    await request(
      graphql`
        mutation activateSenderAccount($userId: String!) {
          activateSenderAccount(userId: $userId) {
            id
          }
        }
      `,
      {
        context: {
          user: senderUser,
        },
        variables: {
          userId: senderUser.id,
        },
      }
    );

    const response = await request(
      graphql`
        query userById($userId: String!) {
          userById(id: $userId) {
            id
            name
            isGuest
            activatedAt
            workspace {
              id
              plan
              name
              slug
              owner {
                id
                name
              }
            }
          }
        }
      `,
      {
        context: {
          user: senderUser,
        },
        variables: {
          userId: senderUser.id,
        },
      }
    );

    expect(response).toEqual({
      data: {
        userById: {
          id: senderUser.id,
          name: expect.any(String),
          isGuest: false,
          activatedAt: expect.any(String),
          workspace: {
            id: expect.any(String),
            name: expect.any(String),
            slug: expect.any(String),
            plan: "SENDER_FREE",
            owner: {
              id: senderUser.id,
              name: expect.any(String),
            },
          },
        },
      },
    });
  });
});
