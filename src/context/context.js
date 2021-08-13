import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

// provider, consumer = githuncontext.provider

const GithubProvider = ({ children }) => {
  const [gitHubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  // request loading

  const [request, setRequest] = useState(0);
  const [loading, setLoading] = useState(false);

  // error
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      // axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
      //   setRepos(response.data)
      // );
      // axios(`${followers_url}?per_page=100`).then((response) =>
      //   setFollowers(response.data)
      // );

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ]).then((result) => {
        const [repos, followers] = result;
        console.log(repos, followers, result);
        const status = "fulfilled";
        if (repos.status === status) {
          setRepos(repos.value.data);
        }
        if (followers.status === status) {
          setFollowers(followers.value.data);
        }
      });
      // setLoading(false);
      // more logic here
    } else {
      toggleError(true, "there is no user with that name");
    }

    checkRequest();
    setLoading(false);
  };

  // check rate
  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        // console.log(data);
        let {
          rate: { remaining },
        } = data;
        // remaining = 0;
        setRequest(remaining);
        if (remaining === 0) {
          toggleError(true, "sorry you have exeeded your hourly");
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  useEffect(checkRequest, []);

  return (
    <GithubContext.Provider
      value={{
        gitHubUser,
        repos,
        followers,
        request,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
