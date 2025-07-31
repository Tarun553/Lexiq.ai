import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Welcome to your AI tools dashboard. Select an option from the sidebar to
        get started.
      </p>
      <div className="flex gap-8">
        <Card className="mt-10 w-[20rem]">
          <CardHeader>
            <CardTitle>Total Creation</CardTitle>
            <div className="flex items-center justify-between">
              <CardTitle>0</CardTitle>
              <CardDescription>icon</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="mt-10 w-[20rem]">
          <CardHeader>
            <CardTitle>Plan Status</CardTitle>
            <div className="flex items-center justify-between">
              <CardTitle>Preium</CardTitle>
              <CardDescription>icon</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-4">Recent Creation</h1>
        <Card className=" w-full">
          <CardHeader>
            <CardTitle>Article</CardTitle>
            <div className="flex items-center justify-between">
              <CardTitle>date</CardTitle>
              <CardDescription>
                <Badge
                  variant="outline"
                  className="text-blue-500 cursor-pointer"
                >
                  <Link to="/ai/write-article">view</Link>
                </Badge>
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
