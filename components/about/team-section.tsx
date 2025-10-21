"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Users } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

const team: TeamMember[] = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    avatar: "AC",
    bio: "Former blockchain engineer at Ethereum Foundation. Passionate about decentralized computing.",
  },
  {
    name: "Sarah Johnson",
    role: "CTO",
    avatar: "SJ",
    bio: "Expert in distributed systems and overlay networks. Led infrastructure at major cloud providers.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Head of Product",
    avatar: "MR",
    bio: "Product strategist with 10+ years in developer tools and cloud platforms.",
  },
  {
    name: "Dr. Emily Wang",
    role: "Head of Research",
    avatar: "EW",
    bio: "PhD in Computer Science, specializing in peer-to-peer networks and consensus algorithms.",
  },
];

export const TeamSection = () => {
  return (
    <section className="py-16">
      <div className="w-full px-6">
        <div className="text-center space-y-4 mb-12">
          <Chip
            color="secondary"
            startContent={<Users size={16} />}
            variant="flat"
          >
            Our Team
          </Chip>
          <h2 className="text-4xl font-bold">Meet the Team</h2>
          <p className="text-lg text-default-600">
            We&apos;re a diverse team of engineers, researchers, and
            entrepreneurs passionate about decentralized computing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="subnet-card text-center">
              <CardBody className="p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-lg">
                    {member.avatar}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm font-medium">
                    {member.role}
                  </p>
                  <p className="text-default-600 text-sm mt-2">{member.bio}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
