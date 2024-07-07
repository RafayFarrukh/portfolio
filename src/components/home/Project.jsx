import React, { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { Jumbotron } from './migration';
import Row from 'react-bootstrap/Row';
import ProjectCard from './ProjectCard';
import { GraphQLClient, gql } from 'graphql-request';

const dummyProject = {
  name: null,
  description: null,
  url: null,
  stargazerCount: null,
  languages: { nodes: [] },
  pushedAt: null,
};

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

// Ensure you have a valid GitHub token with necessary permissions
const graphQLClient = new GraphQLClient(GITHUB_GRAPHQL_API, {
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`, // Replace with your GitHub token
  },
});

const pinnedReposQuery = gql`
  query ($username: String!) {
    user(login: $username) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            languages(first: 5) {
              nodes {
                name
              }
            }
            pushedAt
          }
        }
      }
    }
  }
`;

const Project = ({ heading, username, length }) => {
  const [projectsArray, setProjectsArray] = useState([]);

  const fetchPinnedRepos = useCallback(async () => {
    let repoList = [];
    try {
      const variables = { username };
      const response = await graphQLClient.request(pinnedReposQuery, variables);
      console.log('GraphQL response:', response); // Log the response
      if (response.user && response.user.pinnedItems) {
        repoList = response.user.pinnedItems.nodes;
        setProjectsArray(repoList);
      } else {
        console.error('No pinned repositories found.');
      }
    } catch (error) {
      console.error('Error fetching pinned repositories:', error);
    }
  }, [username]);

  useEffect(() => {
    fetchPinnedRepos();
  }, [fetchPinnedRepos]);

  return (
    <Jumbotron fluid id='projects' className='bg-light m-0'>
      <Container className=''>
        <h2 className='display-4 pb-5 text-center'>{heading}</h2>
        <Row>
          {projectsArray.length
            ? projectsArray.map((project, index) => (
                <ProjectCard
                  key={`project-card-${index}`}
                  id={`project-card-${index}`}
                  value={project}
                />
              ))
            : new Array(length)
                .fill(dummyProject)
                .map((project, index) => (
                  <ProjectCard
                    key={`dummy-${index}`}
                    id={`dummy-${index}`}
                    value={project}
                  />
                ))}
        </Row>
      </Container>
    </Jumbotron>
  );
};

export default Project;
