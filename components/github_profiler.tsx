"use client";

import { useState } from "react";
import "@/styles/style.css";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  ExternalLinkIcon,
  ForkliftIcon,
  LocateIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

type UserProfile = {
  name?: string;
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  followers: number;
  following: number;
  location: string;
  public_repos: number;
};

type UserRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
};

export default function GitHubProfileViewer() {
  const [username, setUsername] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRepos, setUserRepos] = useState<UserRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const profileResponse = await fetch(
        `https://api.github.com/users/${username}`
      );
      if (!profileResponse.ok) throw new Error("User not found");

      const profileData = await profileResponse.json();

      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      if (!reposResponse.ok) throw new Error("Repositories not found");

      const reposData = await reposResponse.json();

      setUserProfile(profileData);
      setUserRepos(reposData);
    } catch (error: any) {
      setError(error.message);
      setUserProfile(null);
      setUserRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle className="card-title">GitHub Profile Explorer</CardTitle>
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchUserData();
          }}
          className="input-container"
        >
          <Input
            type="text"
            placeholder="Enter a GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
          <Button type="submit" disabled={loading} className="button">
            {loading ? <ClipLoader className="w-4 h-4 text-white" /> : "Search"}
          </Button>
        </form>

        {error && <p className="error">{error}</p>}

        {userProfile && (
          <CardContent>
            <div className="text-center">
              <Avatar className="avatar">
                <AvatarImage src={userProfile.avatar_url} />
                <AvatarFallback>
                  {userProfile.login.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mt-4">
                {userProfile.name || userProfile.login}
              </h2>
              <p className="text-gray-600">{userProfile.bio}</p>
              <div className="flex justify-center gap-4 text-sm mt-4">
                <div className="flex items-center gap-1">
                  <UsersIcon className="w-4 h-4" />
                  <span>{userProfile.followers} Followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <UsersIcon className="w-4 h-4" />
                  <span>{userProfile.following} Following</span>
                </div>
                <div className="flex items-center gap-1">
                  <LocateIcon className="w-4 h-4" />
                  <span>{userProfile.location || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ForkliftIcon className="w-4 h-4" />
                  <span>{userProfile.public_repos} Repos</span>
                </div>
              </div>
            </div>
          </CardContent>
        )}

        {userRepos.length > 0 && (
          <CardContent>
            <h3 className="text-xl font-bold mt-6">Repositories</h3>
            <div className="repo-container">
              {userRepos.map((repo) => (
                <Card key={repo.id} className="repo-card">
                  <h4 className="font-semibold text-lg mb-2">
                    <Link href={repo.html_url} target="_blank" className="text-blue-500 hover:underline">
                      {repo.name}
                    </Link>
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    {repo.description || "No description available"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span>{repo.stargazers_count} Stars</span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
