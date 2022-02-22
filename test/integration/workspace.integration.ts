import { createDataFactory } from "../data-factory/index";
import { request, graphql } from "../request";
import { nanoid } from "nanoid";

const datafactory = createDataFactory();

describe(`createWorkspace`, () => {
  let businessUser;

  beforeAll(async () => {
    businessUser = await datafactory.user.create({
      name: "Cameron Jenkinson",
    });
  });

  it(`should create a new workspace and defaults with the business free plan`, async () => {
    const createWorkspaceResponse = await request(
      graphql`
        mutation createWorkspace($input: CreateWorkspaceInput!) {
          createWorkspace(input: $input) {
            id
          }
        }
      `,
      {
        context: {
          user: businessUser,
          services: {
            stripe: {
              customers: {
                create: () => Promise.resolve({ id: `cus_test_${nanoid()}` }),
              },
            },
          },
        },
        variables: {
          input: {
            userId: businessUser.id,
            name: businessUser.name,
            slug: businessUser.name.toLowerCase(),
          },
        },
      }
    );

    const response = await request(
      graphql`
        query workspaceById($id: String!) {
          workspaceById(id: $id) {
            id
            name
            slug
            plan
            activatedAt
            stripeCustomerId
            subscription {
              id
            }
            owner {
              id
              name
              isGuest
              type
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
      `,
      {
        context: {
          user: businessUser,
        },
        variables: {
          id: createWorkspaceResponse?.data?.createWorkspace?.id,
        },
      }
    );

    expect(response).toEqual({
      data: {
        workspaceById: {
          id: expect.any(String),
          name: expect.any(String),
          slug: expect.any(String),
          plan: "BUSINESS_FREE",
          activatedAt: expect.any(String),
          stripeCustomerId: expect.any(String),
          subscriptipn: {
            id: expect.any(String),
          },
          owner: {
            id: businessUser.id,
            name: expect.any(String),
          },
          inbox: {
            id: expect.any(String),
            stacks: expect([
              {
                commentBody:
                  "Your track aligned well and has been shortlisted. More information to follow.",
                name: "First Round",
              },
            ]),
            feedbackTemplates: expect([
              {
                commentBody:
                  "This track did not make it this time but please send more when they are ready. Thank you.",
                label: "Pass",
              },
            ]),
          },
        },
      },
    });
  });
});
