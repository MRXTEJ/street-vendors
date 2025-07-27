import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Code, Palette, Database, Monitor } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  position: number;
  bio?: string;
}

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('position');

      if (error) {
        throw error;
      }

      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('lead') || role.toLowerCase().includes('manager')) {
      return <Users className="w-5 h-5" />;
    }
    if (role.toLowerCase().includes('full stack')) {
      return <Code className="w-5 h-5" />;
    }
    if (role.toLowerCase().includes('backend')) {
      return <Database className="w-5 h-5" />;
    }
    if (role.toLowerCase().includes('frontend')) {
      return <Monitor className="w-5 h-5" />;
    }
    if (role.toLowerCase().includes('ui') || role.toLowerCase().includes('ux')) {
      return <Palette className="w-5 h-5" />;
    }
    return <Code className="w-5 h-5" />;
  };

  const getRoleBadgeColor = (position: number) => {
    const colors = [
      'bg-gradient-to-r from-yellow-400 to-orange-500', // Lead
      'bg-gradient-to-r from-blue-500 to-purple-600',   // Full Stack
      'bg-gradient-to-r from-green-500 to-teal-600',    // Backend
      'bg-gradient-to-r from-pink-500 to-rose-600',     // Frontend
      'bg-gradient-to-r from-indigo-500 to-blue-600'    // UI/UX
    ];
    return colors[position - 1] || colors[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Amazing Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The talented individuals who brought Saathi Supply Hub to life, connecting vendors and suppliers across the city.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {teamMembers.map((member) => (
            <Card key={member.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className={`w-16 h-16 rounded-full ${getRoleBadgeColor(member.position)} flex items-center justify-center text-white shadow-lg`}>
                    {getRoleIcon(member.role)}
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {member.name}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  <Badge 
                    variant="secondary" 
                    className={`${getRoleBadgeColor(member.position)} text-white border-0 shadow-sm`}
                  >
                    {member.role}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-0">
                {member.bio && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                )}
                <div className="mt-3 flex justify-center">
                  <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;