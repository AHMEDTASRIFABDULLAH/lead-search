"use client";
import React, { useState } from "react";
import UserTable from "./UserTable";
import CreateUserModal from "./CreateUserModal";
import Link from "next/link";

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-7xl">
        <Link href={"/"}>
          {" "}
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10 pt-4">
            Admin Panel
          </h1>{" "}
        </Link>
        <div className="grid grid-cols-1 gap-8">
          <UserTable onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Admin;
